var fs = require('fs');
var request = require('sync-request');
var cheerio = require('cheerio');
var crypto = require('crypto');

var taille = /(1|2|3|4|5|6|7|8|9)[\s.-]?(1\/2|½)/;
var areaCode = /([hH]\d[a-zA-Z]) ?(\d{1}[a-zA-Z]\d{1})?/;

function checksum (str, algorithm, encoding) {
  return crypto
  .createHash(algorithm || 'md5')
  .update(str, 'utf8')
  .digest(encoding || 'hex')
}

function read_ad(obj){
  var url = "http://kijiji.ca" + obj.href;
  var content = request('GET', url);
  var $ = cheerio.load(content.body);
  var th = $(".ad-attributes th");
  var td = $(".ad-attributes td");
  var TDs = [];
  var THs = [];
  th.each(function(i, c){
    var header = c.children[0].data.replace(/\n/, '').replace(/^[ ]+/, '');
    THs.push(header);
  })
  td.each(function(i, c){
    if(c.children[0].data) {
      var content = c.children[0].data.replace(/\n/, '').replace(/^[ ]+/, '');
    }
    TDs.push(content);
  })
  TDs[1] = '0.00'; // price placeholder
  TDs.splice(3, 1);
  var attributes = {};
  var lookUp = {
    postedOn: THs.indexOf("Date de l\'affichage"),
    streetAddress: THs.indexOf("Adresse"),
    numberOfBathrooms: THs.indexOf("Salles de bain (nb)"),
    rentedBy: THs.indexOf("À louer par"),
    isFurnished: THs.indexOf("Meublé"),
    petsAreAllowed: THs.indexOf("Animaux acceptés")
  }
  for (var i = 0; i < Object.keys(lookUp).length; i++) {
    var tKey = Object.keys(lookUp)[i];
    if (lookUp[tKey] != -1) {
      attributes[tKey] = TDs[lookUp[tKey]];
    }
  }
  attributes.monthlyRent = $("*[itemprop = 'price']").get(0).children[0].children[0].data.replace(",",".").replace(/[  $$]/g,"");
  return(attributes);
}


// Get front page
var front_page_prefix = "http://www.kijiji.ca/b-appartement-condo/ville-de-montreal"
var front_page_suffix = "c37l1700281?ad=offering"

var titles = {}; //require("./kijiji.json");

for (var page = 1; page < 15; page++) {
  console.log("Page " + page.toString());
  var page_url = front_page_prefix + "/page-" + page.toString() + "/" + front_page_suffix;
  var page_content = request('GET', page_url);
  var $ = cheerio.load(page_content.body);
  $(".title").filter(function(){
    var data = $(this);
    data = data.filter(function(){
      return this.name === 'a';
    });
    for (var i = 0; i < data.length; i++) {
      title = data[i].children[0].data.replace(/\n/, '').replace(/^[ ]+/, '');
      href = data[i].attribs.href;
      if (title.match(taille)) {
        var temp_infos = {title: title, href: href};
        var attributes = read_ad(temp_infos);
        attributes.unitSize = title.match(taille)[1];
        // Check address
        if(attributes.streetAddress) {
          if(attributes.streetAddress.match(areaCode)){
            var getAreaCode = attributes.streetAddress.match(areaCode);
            attributes.areaMajor = getAreaCode[1].toUpperCase();
            if (getAreaCode[2]) {
              attributes.areaMinor = getAreaCode[2].toUpperCase();
            }
            // Add to data
            temp_infos.attributes = attributes;
            titles[checksum(title)] = temp_infos;
          }
        }
      }
    }
  })
  fs.writeFileSync('./kijiji.json', JSON.stringify(titles, null, 2) , 'utf-8');
}
