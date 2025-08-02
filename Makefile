.PHONY: kill-ports

default:
	make kill-ports

kill-ports:
	@echo "Killing processes on ports 4000-4009..."
	@lsof -ti:4000-4009 | xargs kill -9 2>/dev/null || true
	@echo "Ports cleared successfully!" 