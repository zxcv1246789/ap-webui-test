echo "ap 설치"

echo "update 시작"

sudo apt-get update

echo "upgrade 시작"

sudo apt-get upgrade -y

echo "AP서버 다운로드, 압축 해제"

wget https://github.com/zxcv1246789/ap-webui-test/archive/master.zip

unzip master.zip

echo "hostapd 설치 시작"

sudo apt-get install hostapd -y

echo "dnsmasq 설치 시작"

sudo apt-get install dnsmasq -y

echo "hostapd disable 설정"

sudo systemctl disable hostapd

echo "dnsmasq disable 설정"

sudo systemctl disable dnsmasq

echo "static ip 설정"

sudo perl -p -i -e '$.==1 and print "static routers=172.16.171.1\n"' /etc/dhcpcd.conf

sudo perl -p -i -e '$.==1 and print "static ip_address=172.16.171.182/24\n"' /etc/dhcpcd.conf

sudo perl -p -i -e '$.==1 and print "interface eth0\n"' /etc/dhcpcd.conf

echo "hostapd 설정"

sudo touch /etc/hostapd/hostapd.conf

echo "interface=wlan0" | sudo tee -a /etc/hostapd/hostapd.conf
echo "driver=nl80211" | sudo tee -a /etc/hostapd/hostapd.conf
echo "ssid=testAP182" | sudo tee -a /etc/hostapd/hostapd.conf
echo "hw_mode=g" | sudo tee -a /etc/hostapd/hostapd.conf
echo "channel=6" | sudo tee -a /etc/hostapd/hostapd.conf
echo "wmm_enabled=0" | sudo tee -a /etc/hostapd/hostapd.conf
echo "macaddr_acl=0" | sudo tee -a /etc/hostapd/hostapd.conf
echo "auth_algs=1" | sudo tee -a /etc/hostapd/hostapd.conf
echo "wpa=2" | sudo tee -a /etc/hostapd/hostapd.conf
echo "wpa_passphrase=0000000001" | sudo tee -a /etc/hostapd/hostapd.conf
echo "wpa_key_mgmt=WPA-PSK" | sudo tee -a /etc/hostapd/hostapd.conf
echo "wpa_pairwise=TKIP" | sudo tee -a /etc/hostapd/hostapd.conf
echo "rsn_pairwise=CCMP" | sudo tee -a /etc/hostapd/hostapd.conf

sudo mv /etc/default/hostapd /etc/default/hostapd.orig

sudo mv /home/pi/ap-webui-test-master/server/hostapd.orig /etc/default/hostapd

echo "dnsmasq 설정"

sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig

sudo touch /etc/dnsmasq.conf

echo "interface=wlan0" | sudo tee -a /etc/dnsmasq.conf
echo "listen-address=192.168.10.1" | sudo tee -a /etc/dnsmasq.conf
echo "bind-interfaces" | sudo tee -a /etc/dnsmasq.conf
echo "server=8.8.8.8" | sudo tee -a /etc/dnsmasq.conf
echo "domain-needed" | sudo tee -a /etc/dnsmasq.conf
echo "bogus-priv" | sudo tee -a /etc/dnsmasq.conf
echo "dhcp-range=192.168.10.12,192.168.10.200,12h" | sudo tee -a /etc/dnsmasq.conf

echo "interfaces 설정"

sudo mv /etc/network/interfaces /etc/network/interfaces.orig

sudo touch /etc/network/interfaces
echo "source-directory /etc/network/interfaces.d" | sudo tee -a /etc/network/interfaces
echo "allow-hotplug wlan0" | sudo tee -a /etc/network/interfaces
echo "iface wlan0 inet manual" | sudo tee -a /etc/network/interfaces
echo "#wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf" | sudo tee -a /etc/network/interfaces

echo "rc.local 설정"

sudo mv /etc/rc.local /etc/rc.local.orig

sudo mv /home/pi/ap-webui-test-master/server/rc.local /etc/rc.local

echo "rc.local 설정 완료"

echo "ipv4.ip_forward 설정"

sudo mv /etc/sysctl.conf /etc/sysctl.conf.orig

sudo sed -i "28s/.*/net.ipv4.ip_forward=1/g" /etc/sysctl.conf.orig

sudo mv /etc/sysctl.conf.orig /etc/sysctl.conf

sudo sh -c "echo 1 > /proc/sys/net/ipv4/ip_forward"

sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

sudo iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT

sudo iptables -A FORWARD -i wlan0 -o eth0 -j ACCEPT

sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"

echo "hostapd, dnsmasq 서비스 시작"

echo "2. nodejs 설치"

sudo apt-get remove nodejs -y

sudo apt-get autoremove -y

sudo curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

sudo apt-get install nodejs -y

sudo npm install nodemon -g

cd ap-webui-test-master/server/

npm install

echo "4. service 등록"

sudo mv /home/pi/ap-webui-test-master/server/nodeserver.service /etc/systemd/system/nodeserver.service

sudo systemctl enable nodeserver.Service

sudo reboot
