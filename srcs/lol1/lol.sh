#!/bin/bash

printf "HTTP/1.1 200 OK\r\n\r\nVeryLolIsLol" | nc -l 9090
