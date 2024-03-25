#!/bin/bash
###################
# Task Runner     #
# CLABE Validator #
###################

# To make this file runnable:
#     $ chmod +x *.sh.command

banner="CLABE Validator"
projectHome=$(cd $(dirname $0); pwd)
pkgInstallHome=$(dirname $(dirname $(which httpd)))
apacheCfg=$pkgInstallHome/etc/httpd
apacheLog=$pkgInstallHome/var/log/httpd/error_log
webDocRoot=$(grep ^DocumentRoot $apacheCfg/httpd.conf | awk -F'"' '{ print $2 }')

setupTools() {
   # Check for Node.js installation and download project dependencies
   cd $projectHome
   echo
   echo $banner
   echo $(echo $banner | sed s/./=/g)
   pwd
   test -d .git || { echo "Project must be in a git repository."; exit; }
   git restore dist/* &>/dev/null
   git pull --ff-only
   echo
   echo "Node.js:"
   which node || { echo "Need to install Node.js: https://nodejs.org"; exit; }
   node --version
   npm install --no-fund
   npm update --no-fund
   npm outdated
   echo
   }

releaseInstructions() {
   cd $projectHome
   org=$(grep git+https package.json | awk -F'/' '{print $4}')
   name=$(grep '"name":' package.json | awk -F'"' '{print $4}')
   package=https://raw.githubusercontent.com/$org/$name/main/package.json
   version=v$(grep '"version"' package.json | awk -F'"' '{print $4}')
   pushed=v$(curl --silent $package | grep '"version":' | awk -F'"' '{print $4}')
   minorVersion=$(echo ${pushed:1} | awk -F"." '{ print $1 "." $2 }')
   released=$(git tag | tail -1)
   published=v$(npm view $name version)
   test $? -ne 0 && echo "NOTE: Ignore error if package is not yet published."
   echo "Local changes:"
   git status --short
   echo
   echo "Recent releases:"
   git tag | tail -5
   echo
   echo "Release progress:"
   echo "   $version (local) --> $pushed (pushed) --> $released (released) --> $published (published)"
   echo
   test "$version" ">" "$released" && mode="NOT released" || mode="RELEASED"
   echo "Current version is: $mode"
   echo
   nextActionBump() {
      echo "When ready to do the next release:"
      echo
      echo "   === Increment version ==="
      echo "   Edit package.json to bump $version to next version number"
      echo "   $projectHome/package.json"
      }
   nextActionCommitTagPub() {
      echo "Verify all tests pass and then finalize the release:"
      echo
      echo "   === Commit and push ==="
      echo "   Check in all changed files with the message:"
      echo "   Release $version"
      echo
      echo "   === Tag and publish ==="
      echo "   cd $projectHome"
      echo "   git tag --annotate --message 'Release' $version"
      echo "   git remote --verbose"
      echo "   git push origin --tags"
      echo "   npm publish"
      }
   test "$version" ">" "$released" && nextActionCommitTagPub || nextActionBump
   echo
   }

buildProject() {
   cd $projectHome
   echo "Build:"
   npm test
   echo
   }

updateCdnVersion() {
   cd $projectHome
   updateVersion="s|clabe-validator@[.0-9]*|clabe-validator@$minorVersion|"
   sed -i "" $updateVersion README.md
   sed -i "" $updateVersion docs/index.html
   }

publishWebFiles() {
   cd $projectHome
   publishSite=$webDocRoot/centerkey.com
   publishFolder=$publishSite/clabe
   cdnSrc=https://cdn.jsdelivr.net/npm/clabe-validator@$minorVersion/dist/clabe.min.js
   publish() {
      echo "Publishing:"
      echo $publishFolder
      mkdir -p $publishFolder
      sed "s|../dist/clabe.dev.js|$cdnSrc|" spec/clabe.html > $publishFolder/index.html
      ls -o $publishFolder
      grep clabe.min.js $publishFolder/index.html
      echo
      }
   test -w $publishSite && publish
   }

setupTools
releaseInstructions
buildProject
updateCdnVersion
publishWebFiles
sleep 2
open spec/clabe.html
