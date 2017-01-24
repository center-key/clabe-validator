#!/bin/sh
###################
# Task Runner     #
# CLABE Validator #
###################

# To make this file runnable:
#    $ chmod +x *.sh.command

projectHome=$(cd $(dirname $0); pwd)

needNpm() {
   echo "**********************************"
   echo "Need to install Node.js to get npm"
   echo "**********************************"
   open "http://nodejs.org/"
   exit
   }

needGulp() {
   echo "***************************************"
   echo "Need to install Gulp:                  "
   echo "   $ sudo npm install --global gulp-cli"
   echo "***************************************"
   exit
   }

needGulpLocal() {
   echo "***************************************"
   echo "Need to install Gulp locally:          "
   echo "   $ cd $(dirname $0)"
   echo "   $ npm install gulp                  "
   echo "   $ npm update                        "
   echo "***************************************"
   exit
   }

info() {
   cd $projectHome
   echo "npm:"
   which npm || needNpm
   npm --version
   echo
   echo "Gulp:"
   which gulp || needGulp
   gulp --version
   test -d node_modules || needGulpLocal
   echo
   }

runTasks() {
   cd $projectHome
   echo "Tasks:"
   pwd
   echo "To get latest modules --> $ npm update"
   gulp
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
echo
info
runTasks
releaseInstructions
publish
open clabe.html
