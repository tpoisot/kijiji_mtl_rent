library(jsonlite)
library(plyr)
library(data.table)
library(party)

ads <- fromJSON(txt="../kijiji.json")
att <- llply(ads, function(x) data.frame(x$attributes))
rental <- rbindlist(att, fill=T)
rental$monthlyRent <- as.numeric(as.vector(rental$monthlyRent))
rental <- rental[complete.cases(rental),]
