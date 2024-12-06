# Makefile used for common files construction via bash scripts, called by main Makefile.
# Scritp SHOULD accept 2 arguments: directory for file creation and env file location.
# Each script CAN begin by importing the .env file via the following line:
#	export -a "$(cat $2 | grep -v '#' | xargs)"

FILES			= 
DIR				= scripts
TOOLSDIR		= tools
ENV				= .env

SCRIPTS 		= $(addprefix $(DIR)/, $(FILES))
STUFF			= $(addprefix $(TOOLSDIR)/, $(FILES:=.rb))


all: $(STUFF)
re: clean all
clean:
	@echo "Cleaning complete"

$(STUFF):$(TOOLSDIR)/%.rb: $(DIR)/%.sh
	mkdir -p $(TOOLSDIR)
	@echo "Executing $<..."
	$< $(TOOLSDIR) $(ENV)

$(TOOLSDIR):

.PHONY: all re down clean
