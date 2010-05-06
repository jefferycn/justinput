# JustInput Installer 1.2.7

# install service
rootfs_open -w
cp -rf justinput/ /usr/palm/frameworks/mojo/
cp -f justinput.jar /usr/lib/luna/java/
chmod +x /usr/lib/luna/java/justinput.jar
cp -f com.youjf.jisrv.service /usr/share/dbus-1/system-services/
chmod +x /usr/share/dbus-1/system-services/com.youjf.jisrv.service
cp -f com.youjf.com.justinput /etc/event.d/

# a fully hack of framework
mv -f /usr/palm/frameworks/mojo/builtins/palmInitFramework338.js /usr/palm/frameworks/mojo/builtins/palmInitFramework338.js.jeffery
cp -f palmInitFramework338.js /usr/palm/frameworks/mojo/builtins/

cp -f database.db /usr/palm/frameworks/mojo/justinput/JustInput.db

HackFile="/usr/palm/frameworks/mojo/mojo.js"
StartLine=`sed -n "/justinput hack start/=" ${HackFile}`
EndLine=`sed -n "/justinput hack end/=" ${HackFile}`
if ((test ${StartLine} > 0) && (test ${EndLine} > 0)) then
    cp -f ${HackFile} ${HackFile}.old
    sed "${StartLine},${EndLine}d" "${HackFile}" > ${HackFile}.tmp
    mv -f ${HackFile}.tmp ${HackFile}
fi

# hack the mojo.js
cat mojo_append.js >> ${HackFile}


echo "install process finished, you need to reboot your phone"
