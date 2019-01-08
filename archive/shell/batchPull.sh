# !/bin/sh
# Batch pull script for NODE.js projects
# Author@thelostthing
# License@MIT
# Test@Ubuntu_16.04

RED="\033[1;31m"
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
BLUE="\033[1;34m"
ENDCOLOR="\033[0m"

pushd() { 
  command pushd "$@" > /dev/null
}
popd() { 
  command popd "$@" > /dev/null 
}

main() {
  echo -en "${RED}*${ENDCOLOR} $d "
  
  git fetch > /dev/null 2>&1
  
  UPSTREAM=${1:-'@{u}'}
  LOCAL=$(git rev-parse @)
  REMOTE=$(git rev-parse "$UPSTREAM")
  BASE=$(git merge-base @ "$UPSTREAM")
  
  if [ $LOCAL = $REMOTE ]; then
    echo -e "${GREEN}Up to Date${ENDCOLOR}"
  elif [ $LOCAL = $BASE ]; then
    echo -e "${BLUE}Need Pull${ENDCOLOR}"
    
    FLAG_INSTALL=0
    FLAG_UNSTAGED=0
    if [ -f package.json ]; then
      GIT_BRANCH_CURRENT=$(git branch | grep \* | cut -d ' ' -f2)
      GIT_DIFF_PACKAGE=$(git diff --name-only HEAD:package.json origin/${GIT_BRANCH_CURRENT}:package.json)
      if [ ! -z ${GIT_DIFF_PACKAGE} ]; then
          FLAG_INSTALL=1
      fi
    fi
    if [ ! -z "$(git status -s)" ]; then
      FLAG_UNSTAGED=1
      echo -e "${YELLOW}Stashing${ENDCOLOR}"
      # git stash > /dev/null 2>&1
      git add . && git stash
    fi
    
    echo -e "${YELLOW}Pulling${ENDCOLOR}"
    git pull
    
    if [ ${FLAG_UNSTAGED} = 1 ]; then
      echo -e "${YELLOW}UnStashing${ENDCOLOR}"
      # git stash pop > /dev/null 2>&1
      git stash pop
    fi
    if [ ${FLAG_INSTALL} = 1 ]; then
      echo -e "${YELLOW}NPM Installing${ENDCOLOR}"
      if [ -f ./package-lock.json ]; then
        rm ./package-lock.json
      fi
      npm i
    fi
  elif [ $REMOTE = $BASE ]; then
    echo "${RED}Need Push${ENDCOLOR}"
  else
    echo "${RED}Diverged${ENDCOLOR}"
  fi
}

cd "$(dirname ${BASH_SOURCE[0]})"
for d in *; do
  if [ -d $d ]; then
    pushd $d
    if [ ! -d .git ]; then
      popd
      continue
    fi
    main
    popd
  fi
done
