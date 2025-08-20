import sys
import time


print("first print")
sys.stdout.flush()
time.sleep(10)
print("All arguments:", sys.argv)
sys.stdout.flush()

if len(sys.argv) > 1:
    print("User arguments:", sys.argv[1:])
else:
    print("No arguments provided")