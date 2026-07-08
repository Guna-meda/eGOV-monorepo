import json

with open("data/RAINMAKER-PGR.ServiceDefs.json") as f:
    services = json.load(f)

service_lookup = {}

for item in services:

    service_lookup[item["serviceCode"]] = item