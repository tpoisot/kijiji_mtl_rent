library(jsonlite)
library(plyr)
library(data.table)
library(party)

mkdf <- function(f) {
  ads <- fromJSON(txt=f)
  att <- llply(ads, function(x) data.frame(x$attributes))
  rental <- rbindlist(att, fill=T)
  rental$monthlyRent <- as.numeric(as.vector(rental$monthlyRent))
  rental <- rental[complete.cases(rental),]
  return(rental)
}

k1 <- mkdf("../kijiji.json")
k2 <- mkdf("../1.json")
k3 <- mkdf("../2.json")
kjj <- unique(data.frame(rbind(k1, k2, k3)))
kjj <- subset(kjj, monthlyRent < 8000)
kjj$unitSize <- factor(as.numeric(as.vector(kjj$unitSize)))
kjj$area <- factor(substr(kjj$areaMajor, 1, 2))
