#!/bin/sh
###################
# Task Runner     #
# CLABE Validator #
###################

# To make this file runnable:
#    $ chmod +x *.sh.command

projectHome=$(cd $(dirname $0); pwd)

info() {
   cd $projectHome
   pwd
   echo
   echo "Node.js:"
   which node || { echo "Need to install Node.js: https://nodejs.org"; exit; }
   node --version
   test -d node_modules || npm install
   npm update
   npm outdated
   echo
   }

releaseInstructions() {
   cd $projectHome
   version=$(grep '"version"' package.json | awk -F'"' '{print $4}')
   echo "Tagged releases:"
   git tag
   echo
   echo "To tag this release:"
   echo "   cd $(pwd)"
   echo "   git tag -af $version -m \"Stable release\""
   echo "   git remote -v"
   echo "   git push origin --tags --force"
   echo "   npm publish"
   echo
   }

publish() {
   cd $projectHome
   publishWebRoot=$(grep ^DocumentRoot /private/etc/apache2/httpd.conf | awk -F\" '{ print $2 }')
   publishFolder=$publishWebRoot/centerkey.com/clabe
   copyWebFiles() {
      echo "Publishing:"
      cp -v clabe.js $publishFolder
      cp -v clabe.html $publishFolder/index.html
      echo
      }
   test -w $publishFolder && copyWebFiles
   }

echo
echo "Task Runner"
echo "==========="
info
cd $projectHome
echo "Build:"
npm test
echo
releaseInstructions
publish
sleep 2
open clabe.html
