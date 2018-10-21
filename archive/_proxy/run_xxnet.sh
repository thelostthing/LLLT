#!/bin/bash
echo Running XX-Net
if [ "$1" == "r" ]
then
    sudo service miredo restart && '/home/dogepad/Downloads/proxy/XX-Net/XX-Net-3.7.5/start'
else
    if (( $(ps -ef | grep -v grep | grep miredo | wc -l) > 0 ))
    then
        '/home/dogepad/Downloads/proxy/XX-Net/XX-Net-3.7.5/start'
    else
        sudo service miredo start && '/home/dogepad/Downloads/proxy/XX-Net/XX-Net-3.7.5/start'
    fi
fi
