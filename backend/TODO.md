# TODO

- [x] Simple http router
- [ ] Add params extraction to router (i.e. `/{id}` or `/:id`)
- [ ] Punycode converter
- [ ] [Check for invalid domain](src/utils.js#L34)
- [ ] Proper punycode domain check (i.e. `привет.рф`)
- [ ] `child_process.exec()` security concern

# Some difficulties

- Whois servers have different response for a state, i.e. `NOT FOUND` and `The queried object does not exist` are the same.
