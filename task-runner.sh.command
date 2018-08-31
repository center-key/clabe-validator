#!/bin/bash
###################
# Task Runner     #
# CLABE Validator #
###################

# To make this file runnable:
#     $ chmod +x *.sh.command

banner="CLABE Validator"
projectHome=$(cd $(dirname $0); pwd)

setupTools() {
   # Check for Node.js installation and download project dependencies
   cd $projectHome
   echo
   echo $banner
   echo $(echo $banner | sed -e "s/./=/g")
   pwd
   echo
   echo "Node.js:"
   which node || { echo "Need to install Node.js: https://nodejs.org"; exit; }
   node --version
   npm install
   npm update
   npm outdated
   echo
   }

buildProject() {
   cd $projectHome
   echo "Build:"
   npm test
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
   echo "   git tag --annotate --force --message 'Release' $version"
   echo "   git remote --verbose"
   echo "   git push origin --tags --force"
   echo "   npm publish"
   echo
   }

publishWebFiles() {
   cd $projectHome
   publishWebRoot=$(grep ^DocumentRoot /private/etc/apache2/httpd.conf | awk -F\" '{ print $2 }')
   publishSite=$publishWebRoot/centerkey.com
   publishFolder=$publishSite/clabe
   publish() {
      echo "Publishing:"
      mkdir -p $publishFolder
      cp -v clabe.js   $publishFolder
      cp -v clabe.html $publishFolder/index.html
      echo
      }
   test -w $publishSite && publish
   }

setupTools
buildProject
releaseInstructions
publishWebFiles
sleep 2
open clabe.html
