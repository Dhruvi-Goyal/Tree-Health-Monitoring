
// Set total_files according to the number of result files for a particular ACZ
// in a particular year
var total_files = 1;

var year = '2022';

// var acz = 'Eastern Plateau & Hills Region';
// var acz = 'Middle Gangetic Plain Region';
// var acz = 'Lower Gangetic Plain Region';
// var acz = 'Western Himalayan Region';
// var acz = 'Eastern Himalayan Region';
// var acz = 'Upper Gangetic Plain Region';
// var acz = 'Trans Gangetic Plain Region';
// var acz = 'Central Plateau & Hills Region';
// var acz = 'Western Plateau and Hills Region';
// var acz = 'Southern Plateau and Hills Region';
var acz = 'East Coast Plains & Hills Region';

var res_list = [];
for (var i=0; i<total_files; i++) {
  res_list.push('_result_' + String(i) + '_');
}

var agroclimaticZoneAcronymDict = {
  'Eastern Plateau & Hills Region': 'EPAHR',
  'Southern Plateau and Hills Region': 'SPAHR',
  'East Coast Plains & Hills Region': 'ECPHR',
  'Western Plateau and Hills Region': 'WPAHR',
  'Central Plateau & Hills Region': 'CPAHR',
  'Lower Gangetic Plain Region': 'LGPR',
  'Middle Gangetic Plain Region': 'MGPR',
  'Upper Gangetic Plain Region': 'UGPR',
  'Trans Gangetic Plain Region': 'TGPR',
  'Eastern Himalayan Region': 'EHR',
  'Western Himalayan Region': 'WHR'
};

var acronym = agroclimaticZoneAcronymDict[acz];

var india_boundary = ee.FeatureCollection("projects/ee-mtpictd/assets/harsh/Agroclimatic_regions");
var aoi = india_boundary.filter(ee.Filter.eq('regionname', acz)).geometry();

// correction ccd
for (var k=0; k<res_list.length; k++) {

  var res = res_list[k];

  var fc = ee.FeatureCollection('projects/ee-mtpictd/assets/harsh/corrections_ccd_' + year + res + acronym);
  
  var bands = ['cc_' + year];
  
  var district_img = ee.Image(0);
  
  for (var i=0; i<bands.length; i++) {
    
    var image = fc.reduceToImage({
      // List of properties to convert to bands
      properties: [bands[i]],
    
      // Reducer function (optional, default is 'first')
      reducer: ee.Reducer.first() // Chooses the value from the first feature for each pixel
    });
    
    image = image.rename([bands[i]]);
    // print(image);
  
    district_img = district_img.addBands(image);
  }
  
  district_img = district_img.reproject('EPSG:4326', null, 25).clip(aoi).select(bands);
  print(district_img);
  
  Export.image.toAsset({
    image: district_img,
    description: 'fc_to_image_corrections_ccd_' + year + '_' + acronym,
    assetId: 'projects/ee-mtpictd/assets/harsh/corrections_ccd_'+ year + '/corrections_ccd_' + year + res + acronym,
    region: aoi,
    scale: 25,
    crs: 'EPSG:4326',
    maxPixels: 10000000000
  });
  
}



// correction ch
for (var k=0; k<res_list.length; k++) {

  var res = res_list[k];

  var fc = ee.FeatureCollection('projects/ee-mtpictd/assets/harsh/corrections_ch_' + year + res + acronym);
  
  var bands = ['rh50_' + year, 'rh75_' + year, 'rh98_' + year, 'ch_' + year];
  
  var district_img = ee.Image(0);
  
  for (var i=0; i<bands.length; i++) {
    
    var image = fc.reduceToImage({
      // List of properties to convert to bands
      properties: [bands[i]],
    
      // Reducer function (optional, default is 'first')
      reducer: ee.Reducer.first() // Chooses the value from the first feature for each pixel
    });
    
    image = image.rename([bands[i]]);
    // print(image);
  
    district_img = district_img.addBands(image);
  }
  
  district_img = district_img.reproject('EPSG:4326', null, 25).clip(aoi).select(bands);
  print(district_img);
  
  Export.image.toAsset({
    image: district_img,
    description: 'fc_to_image_corrections_ch_' + year + '_' + acronym,
    assetId: 'projects/ee-mtpictd/assets/harsh/corrections_ch_'+ year + '/corrections_ch_' + year + res + acronym,
    region: aoi,
    scale: 25,
    crs: 'EPSG:4326',
    maxPixels: 10000000000
  });
  
}
