# TODO

- [x] Simple http router
- [x] Add params extraction to router (i.e. `/{id}` or `/:id`)
- [x] Update linter config
- [x] Promisify all the code
- [ ] Some queue(ZeroMQ, etc)
- [ ] Caching (Websocket, etc)
- [ ] Store tlds and whois servers in memory and update them
- [ ] `child_process.exec()` security concern
- [ ] Punycode converter
- [ ] [Check for invalid domain](src/utils.js#L34)
- [ ] Proper punycode domain check (i.e. `привет.рф`)

## Some difficulties

- Whois servers have different response for a state, i.e. `NOT FOUND` and `The queried object does not exist` are the same.
- Outdated or/and not full public whois servers list, i.e. `https://www.nirsoft.net/whois-servers.txt` doesn't have servers for many domains and `http://whois-server-list.github.io/whois-server-list/3.0/whois-server-list.xml` is 1 year old, although it has domain available/not available search strings.

## Notes

- We can use `https://www.iana.org/whois?q=domain` to query if request limit reached on whois, seems it doesn't have captcha.
- Try different methods if whois console query failed
