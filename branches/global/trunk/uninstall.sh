# JustInput unInstaller 1.0

# install service
rootfs_open -w
rm -rf /usr/palm/frameworks/mojo/justinput/
rm -f /usr/lib/luna/java/justinput.jar
rm -f /usr/share/dbus-1/system-services/com.youjf.jisrv.service
rm -f /etc/event.d/com.youjf.com.justinput
rm -f /media/internal/.app-storage/JustInput.db

HackFile="/usr/palm/frameworks/mojo/mojo.js"
StartLine=`sed -n "/justinput hack start/=" ${HackFile}`
EndLine=`sed -n "/justinput hack end/=" ${HackFile}`
if ((test ${StartLine} > 0) && (test ${EndLine} > 0)) then
    cp -f ${HackFile} ${HackFile}.old
    sed "${StartLine},${EndLine}d" "${HackFile}" > ${HackFile}.tmp
    mv -f ${HackFile}.tmp ${HackFile}
fi

echo "uninstall process finished, you need to reboot your phone"
