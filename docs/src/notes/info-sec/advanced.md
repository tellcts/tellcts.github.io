---
title: 案例知识总结
titleTemplate: :title - 信息安全工程师
---
# 一、iptables防火墙

## 1.1 iptables简介
1. **iptables**是Linux系统自带的防火墙，相较于它现在更为先进的版本是**nftables**。
2. 大致来说iptables也就是**四表五链**：
:::tip 四表
- **filter**：用于过滤数据包（允许 / 拒绝通过），是最常用的表，默认操作此表。
- **nat**：用于网络地址转换（Network Address Translation）。
- **mangle**：用于修改数据包的 “标记”（如 TOS 字段、TTL 等），或给数据包打自定义标记。
- **raw**：用于处理数据包的 “连接追踪”（关闭特定数据包的追踪），优先级最高。
:::
:::tip 五链
- **INPUT**：数据包经过路由判断后，**目标是本机**（如访问本机的 22 端口），进入用户空间前。
- **OUTPUT**：本机产生的数据包，**离开用户空间后，路由判断前**（准备发送到网卡时）。
- **FORWARD**：数据包经过路由判断后，**需要转发给其他机器**（本机作为路由器时生效）。
- **PREROUTING**：数据包到达网卡后，**路由判断前**（还未决定是发给本机还是转发给其他机器）。
- **POSTROUTING**：数据包经过路由判断后，**即将从网卡发出时**（无论本机产生还是转发的包，最终都会经过这里）。
:::
:::tip 表、链归属关系
- **filter**：INPUT -> FORWARD -> OUTPUT -> （用户自定义链）
- **nat**：PREROUTING -> POSTROUTING -> OUTPUT -> （用户自定义链）
- **mangle**：PREROUTING -> INPUT -> FORWARD -> OUTPUT -> POSTROUTING -> （用户自定义链）
- **raw**：PREROUTING	OUTPUT ->（用户自定义链）
:::


## 1.2 iptables语法
1. 基本语法结构：未指定表名时默认为`filter`。
~~~bash
iptables [-t 表名] 操作选项 [链名] [匹配条件] [-j 动作]
~~~

:::tip
- 当服务器主机配置多个网卡时，需要使用`-i eth0,-o eth0`命令选项，单网卡主机无需此命令选项。
- 以下使用的命令`-m state --state`可以使用现代化的`-m conntrack --ctstate`代替。
:::

2. 清除指定表规则
~~~bash
# 清除指定表中所有规则
iptables -F 			
iptables -t nat -F	
iptables -t mangle -F
iptables -t raw -F

# 清除指定表中指定链的所有规则
iptables -F INPUT
iptables -t nat -F PREROUTING
......
~~~

3. 设置默认策略（当与所有规则不匹配时就匹配默认策略）
~~~bash
# 默认拦截所有进站流量
iptables -P INPUT DROP
# 默认拦截所有出站流量
iptables -P OUTPUT DROP
# 默认拦截所有转发流量
iptables -P FORWARD DROP
~~~

4. 拦截来自指定IP地址（网络）的流量
~~~bash
iptables -A INPUT -s 192.168.1.100 -j DROP
iptables -A INPUT -s 10.1.1.0/24 -j DROP
~~~

5. 允许指定服务入站流量请求
~~~bash
# 允许 SSH 服务请求流量入站
iptables -A INPUT -i eth0 -p tcp --dport 22 -m state --state NEW,ESTABLISHED -j ACCEPT
# 若是filter表的OUTPUT链默认策略是DROP，则需要放行上述服务的出站流量
iptables -A OUTPUT -o eth0 -p tcp --sport 22 -m state --state ESTABLISHED -j ACCEPT

# 允许 HTTP 服务请求流量入站
iptables -A INPUT -i eth0 -p tcp --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -o eth0 -p tcp --sport 80 -m state --state ESTABLISHED -j ACCEPT

# 使用 multiport 模块同时配置多个服务的入站请求流量
iptables -A INPUT -i eth0 -p tcp -m multiport --dports 22,80,443 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -o eth0 -p tcp -m multiport --sports 22,80,443 -m state --state ESTABLISHED -j ACCEPT
~~~

6. 当使用SSH远程配置服务器时，请务必先配置以下命令
~~~bash
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED.RELATED -j ACCEPT
~~~

7. 允许本机作为SSH客户端连接SSH服务
~~~bash
iptables -A OUTPUT -p tcp --dport 22 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A INPUT -p tcp --sport 22 -m state --state ESTABLISHED -j ACCEPT

# 只能连接指定网段的 SSH 服务
iptables -A OUTPUT -p tcp -d 192.168.1.0/24 --dport 22 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A INPUT -p tcp --sport 22 -m state --state ESTABLISHED -j ACCEPT
~~~

8. 网络地址转换（NAT）
~~~bash
# 源地址转换（SNAT）规则只能定义在 POSTROUTING 链中，目的地址转换（DNAT）规则只能定义在PREROUTING链中
iptables -t nat -A POSTROUTING -s 192.168.1.100 -o eth0 -j SNAT --to-source 152.120.1.100 # 静态源地址转换
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j MASQUERADE # 动态源地址转换
iptables -t nat -A PREROUTING -d 152.120.1.100 -i eth0 -j DNAT --to-destination 192.168.1.100 # 目的地址转换
~~~
   
9. 对HTTPS流量进行负载均衡（端口转发）
~~~bash
iptables -t nat PREROUTING -i eth0 -p tcp --dport 443 -m state --state NEW -m nth --counter 0 --every 3 --packet 0 -j DNAT --to-destination 192.168.1.100:443
iptables -t nat PREROUTING -i eth0 -p tcp --dport 443 -m state --state NEW -m nth --counter 0 --every 3 --packet 1 -j DNAT --to-destination 192.168.1.200:443
iptables -t nat PREROUTING -i eth0 -p tcp --dport 443 -m state --state NEW -m nth --counter 0 --every 3 --packet 2 -j DNAT --to-destination 192.168.1.300:443
~~~

10. 允许内网主机ping外网主机
~~~bash
iptables -A OUTPUT -p icmp --icmp-type echo-request -j ACCEPT
iptables -A INPUT -p icmp --icmp-type echo-reply -j ACCEPT
~~~

11. 允许本地回环通信
~~~bash
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT
~~~

12. 允许转发内网发往外网的流量
~~~bash
# 假定 eth0 链接内网，eth1 链接外网
iptables -A FORWARD -i eth0 -o eth1 -j ACCEPT
~~~

13. 允许本机连接外部DNS服务
~~~bash
iptables -A OUTPUT -o eth0 -p udp --dport 53 -j ACCEPT
iptables -A INPUT -i eth0 -p udp --sport 53 -j ACCEPT
~~~

14. 只允许指定网段连接本机的MySQL服务
~~~bash
iptables -A INPUT -i eth0 -p tcp --dport 3306 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -o eth0 -p tcp --sport 3306 -m state --state ESTABLISHED -j ACCEPT
~~~

15. 允许指定网段连接本机的rsync服务,用于文件同步、镜像站点（rsyncd守护进程默认端口873）
~~~bash
iptables -A INPUT -i eth0 -s 192.168.1.0/24 -p tcp --dport 873 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -o eth0 -p tcp --sport 873 -m state --state ESTABLISHED -j ACCEPT
~~~

16. 将本机作为邮件服务器（需要开启邮件发送服务、邮件接收服务）
~~~bash
# 允许外部主机访问邮件发送服务 SMTP 
iptables -A INPUT -i eth0 -p tcp --dport 25 -m state --state MEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -o eth0 -p tcp --sport 25 -m state --state ESTABLISHED -j ACCEPT

# 允许外部主机访问邮件接收服务 IMAP IMAPS POP3 POP3S，添加 S 的服务表明提供加密服务
# IMAP
iptables -A INPUT -i eth0 -p tcp --dport 143 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -o eth0 -p tcp --sport 143 -m state --state ESTABLISHED -j ACCEPT
# IMAPS
iptables -A INPUT -i eth0 -p tcp --dport 993 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -o eth0 -p tcp --sport 993 -m state --state ESTABLISHED -j ACCEPT
# POP3
iptables -A INPUT -i eth0 -p tcp --dport 110 -m state --state NEW,ESTABLISHED -j ACCEPT
iptabels -A OUTPUT -o eth0 -p tcp --sport 110 -m state --state ESTABLISHED -j ACCEPT
# POP3S
iptables -A INPUT -i eth0 -p tcp --dport 995 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -o eth0 -p tcp --sport 995 -m state --state ESTABLISHED -j ACCEPT
~~~

17. 防范DoS攻击
~~~bash
# 每分钟生成 25 个令牌，令牌桶上限 100 个。表明允许最大突发100个HTTP请求流量，每分钟补充25个令牌。
iptables -A INPUT -i eth0 -p tcp --dport 80 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT
~~~

18. 端口转发
~~~bash
# 配置端口转发一般还需要配置filter表的FORWARD链,内网网卡 eth0，外网网卡 eth1
iptables -t nat PREROUTING -i eth1 -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.100:80
iptables -t nat POSTROUTING -0 eth1 -p tcp -s 192.168.1.100 -j SNAT --to-source 152.120.1.100
iptables -A FORWARD -i eth1 -o eth0 -p tcp -d 192.168.1.100 --dport 80 -j ACCEPT
iptables -A FORWARD -i eth0 -o eth1 -p tcp -s 192.168.1.100 --sport 80 -m state --state ESTABLISHED,RELATED -j ACCEPT
~~~

19. 日志记录访问Telnet服务的流量
~~~bash
iptables -A INPUT -p tcp --dport 23 -j LOG --log-prefix "FORBIDDEN-TELNET"  --log-level 7
iptables -A INPUT -p tcp --dport 23 -j DROP
~~~

<br>
<br>
<br>

# 二、Wireshark过滤器语法

## 2.1 捕获过滤器语法（BPF语法）
|    类别     |            关键字            |                            说明                            |
| :---------: | :--------------------------: | :--------------------------------------------------------: |
|  协议筛选   |            **ip**            |                  仅捕获 IPv4 协议的数据包                  |
|             |          **ether**           |                  仅捕获以太网协议的数据包                  |
|             |           **ipv6**           |                  仅捕获 IPv6 协议的数据包                  |
|             |           **tcp**            |                  仅捕获 TCP 协议的数据包                   |
|             |           **udp**            |                  仅捕获 UDP 协议的数据包                   |
|             |           **icmp**           |           仅捕获 ICMP 协议的数据包（如 ping 包）           |
|             |           **arp**            |          仅捕获 ARP 协议的数据包（地址解析协议）           |
| 主机/IP筛选 |       **host <地址>**        | 捕获与指定主机 / IP / MAC相关的所有包（源或目的为该地址）  |
|             |        **src <地址>**        |            捕获源地址为指定主机 / IP / MAC的包             |
|             |        **dst <地址>**        |           捕获目的地址为指定主机 / IP / MAC的包            |
|  网段筛选   |        **net <网段>**        | 捕获指定网段内的数据包（支持 **CIDR** 或**子网掩码**格式） |
|             |      **src net <网段>**      |                 捕获源地址属于指定网段的包                 |
|             |      **dst net <网段>**      |                捕获目的地址属于指定网段的包                |
|  端口筛选   |      **port <端口号>**       |         捕获包含指定端口的包（源或目的端口为该值）         |
|             |    **src port <端口号>**     |                   捕获源端口为指定值的包                   |
|             |    **dst port <端口号>**     |                  捕获目的端口为指定值的包                  |
|             |   **portrange <端口范围>**   |     捕获端口在指定范围内的包（格式：**`start-end`**）      |
|             | **src portrange <端口范围>** |                 捕获源端口在指定范围内的包                 |
|             | **dst portrange <端口范围>** |                捕获目的端口在指定范围内的包                |
|  逻辑运算   |           **not**            |                 排除符合条件的包（非运算）                 |
|             |           **and**            |                 同时满足多个条件（与运算）                 |
|             |            **or**            |                 只要满足一个条件（或运算）                 |
|             |           **（）**           |                 改变运算优先级（组合条件）                 |


## 2.2 显示过滤器语法
|   协议   |                  字段                  |                  说明                   |                    示例                    |
| :------: | :------------------------------------: | :-------------------------------------: | :----------------------------------------: |
|  以太网  |              **eth.src**               |            以太网源 MAC 地址            |       `eth.src == 00:1a:2b:3c:4d:5e`       |
|          |              **eth.dst**               |           以太网目的 MAC 地址           |   `eth.dst == ff:ff:ff:ff:ff:ff`（广播）   |
|          |              **eth.type**              |  以太网类型（0x0800=IPv4，0x0806=ARP）  |     `eth.type == 0x0800`（仅 IPv4 包）     |
|   IPv4   |               **ip.src**               |               源 IP 地址                |         `ip.src == 192.168.1.100`          |
|          |               **ip.dst**               |              目的 IP 地址               |            `ip.dst == 8.8.8.8`             |
|          |              **ip.addr**               |            源或目的 IP 地址             |           `ip.addr == 10.0.0.5`            |
|          |              **ip.proto**              |  IP 协议类型（6=TCP，17=UDP，1=ICMP）   |        `ip.proto == 6`（仅 TCP 包）        |
|          |               **ip.ttl**               |            生存时间（TTL）值            |               `ip.ttl == 64`               |
|   TCP    |              **tcp.port**              |            TCP 源或目的端口             |             `tcp.port == 8080`             |
|          |            **tcp.srcport**             |               TCP 源端口                |            `tcp.srcport == 80`             |
|          |            **tcp.dstport**             |              TCP 目的端口               |            `tcp.dstport == 443`            |
|          |           **tcp.flags.syn**            |       SYN 标志位（1 = 连接请求）        |            `tcp.flags.syn == 1`            |
|          |           **tcp.flags.ack**            |       SYN 标志位（1 = 确认回复）        |            `tcp.flags.ack == 1`            |
|          |           **tcp.flags.rst**            |       RST 标志位（1 = 强制断开）        |            `tcp.flags.rst == 1`            |
|          | <u>**tcp.analysis.retransmission**</u> |        TCP 重传包（需开启分析）         |       `tcp.analysis.retransmission`        |
|   UDP    |              **udp.port**              |            UDP 源或目的端口             |         `udp.port == 5353`（mDNS）         |
|          |            **udp.srcport**             |               UDP 源端口                |       `udp.srcport == 53`（DNS 源）        |
|          |            **udp.dstport**             |              UDP 目的端口               |        `udp.dstport == 161`（SNMP）        |
|   ICMP   |             **icmp.type**              |  ICMP 类型（8=ping 请求，0=ping 应答）  |       `icmp.type == 8`（ping 请求）        |
|   ARP    |             **arp.opcode**             |    ARP 操作码（1 = 请求，2 = 应答）     |       `arp.opcode == 1`（ARP 请求）        |
|          |         **arp.src.proto_ipv4**         |             ARP 源 IP 地址              |    `arp.src.proto_ipv4 == 192.168.1.1`     |
|   HTTP   |            **http.request**            |    所有 HTTP 请求包（客户端→服务器）    |               `http.request`               |
|          |        **http.request.method**         |      HTTP 请求方法（GET/POST 等）       |      `http.request.method == "POST"`       |
|          |         **http.response.code**         | HTTP 响应状态码（200=成功，404=未找到） |        `http.response.code == 404`         |
|          |             **http.host**              |   HTTP 请求的 Host 头部（目标主机名）   |      `http.host == "www.example.com"`      |
|   DNS    |         **dns.flags.response**         |   DNS 响应标志（0 = 请求，1 = 响应）    |    `dns.flags.response == 1`（响应包）     |
|          |            **dns.qry.name**            |             DNS 查询的域名              |       `dns.qry.name == "baidu.com"`        |
|          |             **dns.rcode**              |      DNS 响应码（3 = 域名不存在）       |              `dns.rcode == 3`              |
| 逻辑运算 |                  `==`                  |                  等于                   |             `tcp.port == 443`              |
|          |                  `!=`                  |                 不等于                  |             `tcp.port != 443`              |
|          |             `>  <  >=  <=`             |     大于、小于、大于等于、小于等于      |             `udp.length > 100`             |
|          |                   `                    |                                         |                     `                      | 或 | `icmp.type == 8 |  | arp.opcode ==1` |
|          |                  `&&`                  |                   且                    | `tcp.flags.syn == 1 && tcp.flags.ack == 0` |
|          |                  `!`                   |                   非                    |                   `!ip`                    |
|          |               `contains`               |            包含字符串 / 字节            |    `http.request.uri contains "login"`     |
|          |                  `in`                  |              在指定列表中               |          `tcp.port in {80, 443}`           |
