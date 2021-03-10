import csv
arr = []
counties = {}
reader = csv.DictReader(open("arcos-fl-statewide-itemized.csv"))
for row in reader:
    try:
        counties[row["BUYER_COUNTY"]]
    except:
        counties[row["BUYER_COUNTY"]] = {}
    try:
        counties[row["BUYER_COUNTY"]][row["DRUG_NAME"]]
    except:
        counties[row["BUYER_COUNTY"]][row["DRUG_NAME"]] = 0.0
    counties[row["BUYER_COUNTY"]][row["DRUG_NAME"]] += float(row["QUANTITY"])


write = open("pillsByCounty.csv","a")
write.write("BUYER_COUNTY,OXYCODONE_COUNT,HYDROCODONE_COUNT\n")
for (key,value) in counties.items():
    try:
        value["OXYCODONE"]
    except:
        value["OXYCODONE"] = 0
    try:
        value["HYDROCODONE"]
    except:
        value["HYDROCODONE"] = 0
    write.write(key + "," + str(value["OXYCODONE"]) + "," + str(value["HYDROCODONE"]) + "\n")