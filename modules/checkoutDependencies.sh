#!/usr/bin/env bash

cd ./modules
DIR="./ks-react-authentication"
if [ -d "$DIR" ]; then
  echo "The ks-react-authentication dependency already exists, pulling from github"
  cd $DIR
  git pull
else
  echo "Cloning the ks-react-authentication dependency"
  git clone git@github.com:rjojjr/ks-react-authentication.git
fi
