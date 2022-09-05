---
title: "Commonly Used Commands"
description: "Quick reference for useful commands"
date: 2019-11-28
---

This is a bookmark-able reference to commonly used commands in Unix-like environments.

<!--more-->

## tar 

Basic tar commands. [Remember this one?](https://xkcd.com/1168/)

```bash
tar czf file.tar.gz <files> # create a tarball
tar xzf file.tar.gz         # extract a tarball
```

## dd 

Useful for creating files of arbitrary size with pseudorandom content.

```bash
dd if=/dev/urandom of=target-file bs=1M count=10
```

`if` is the input file, `of` is the output file, and `bs` is the block size. 
`count` is number of blocks to read from `if` and write to `of`.

### split 

Splitting files. Use `-d` for numeric suffixes.

```bash
split -b 8K <file> <prefix-name>    # split a file into 8kb chunks
split -n 128 <file>                 # split a file into 128 chunks
```

### scp

Basic copy syntax. Use `-r` for copying directories recursively.

```bash
scp -i path_to_secret.pem local_file.txt remote_username@10.10.0.2:/remote/directory
scp -i path_to_secret.pem remote_username@10.10.0.2:/remote/file.txt /local/directory
scp user1@host_1.com:/files/file.txt user2@host_2.com:/files
```

### ssh

Generate an RSA SSH key:

```bash
ssh-keygen -t rsa -b 2048 -C "foo@bar.com"
```

SSH config example Host block

```bash
# ~/.ssh/config

Host <name>
  Hostname <ipv4>
  User <user>
  Port <port>
  IdentitiesOnly <yes/no>
  IdentityFile <path_to_secret>
```

To proxy using a bastion host, use the following directive in the config.

```bash
  ProxyCommand ssh -W %h:%p <name-of-jump-server> 
```

```bash
# Add an SSH key to authentication agent

ssh-add -K ~/.ssh/id_rsa
```

```bash
# ~/.ssh/config (bg SSH session with port forwarding
# e.g. running remote jupyter notebooks)

Host foo
  Hostname <ipv4>
  User <user>
  IdentityFile <path_to_secret>

$ ssh -NfL 9999:localhost:8888 foo
```

### psql

Common PostgreSQL slash commands

```bash
 \l         # list databases
 \c orders  # switch to database 'orders'
 \dt        # list tables
 \conninfo  # echo connection info
 \des       # list foreign servers
 \dew       # list foreign data wrappers
 \?         # get meta-command help
```

Connect to a PostgreSQL database

```bash
psql -h <host> -p <port> -d <db> -U <user>
```
