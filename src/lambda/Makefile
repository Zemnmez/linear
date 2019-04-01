handlers = $(patsubst handler/%,dist/%,$(wildcard handler/*))

dist.zip: $(handlers)
	zip -FSj $@ $^

#getDeps = $(shell go list -f '{{.Deps}}' $(1) | xargs go list -f '{{$$this:=.}}{{range .GoFiles}}{{$$this.Dir}}/{{.}} {{end}}')
# maybe one day i will generate the deps dynamically lol
# must be forced because cant determine whether update is
# needed purely based on go files
dist/%: handler/%.go.Makefile
	$(MAKE) -$(MAKEFLAGS) -f $< dist/$*

handler/%/bin:

.PHONY: run lambda
run: $(handlers)
	sam local start-api --region us-west-1 --debug --s ../static

test: $(handlers)
	sam local start-api --region us-west-1 --debug & \
	SVR="$$!"; \
	(sleep 120 && kill -9 $$!) & \
	sleep 4; \
	API_TEST_ADDRESS=http://localhost:3000 ginkgo ../api; \
	kill -9 $$SVR

testfast: $(handlers)
	sam local start-api --region us-west-1 --debug & \
	SVR="$$!"; \
	(sleep 120 && kill -9 $$!) & \
	sleep 4; \
	API_TEST_ADDRESS=http://localhost:3000 ginkgo -failFast ../api; \
	kill -9 $$SVR


%.package-deps.txt: % .FORCE
	go list -f '{{range .Deps}}{{.}} {{end}}' ./$* > $@

%.package-name.txt: %
	echo "$(notdir $<)" > $@

%.file-deps.txt: %.package-deps.txt .FORCE
	cat $< | xargs go list -f '{{$$t:=.}}{{range .GoFiles}}{{$$t.Dir}}/{{.}} {{end}}' | \
		tr '\n' ' ' | sed -E 's/[ ]+/ /g' > $@

%.go.Makefile: %.file-deps.txt %.package-name.txt
	echo "dist/$$(cat $*.package-name.txt): $$(cat $<)\\n\\tGO111MODULE=auto GOOS=linux go build -v -o \$$@ ./$*\\n" > $@




.PHONY: .FORCE
.FORCE:
