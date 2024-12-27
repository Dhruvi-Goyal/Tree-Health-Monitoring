// Perform Dynamic World (DW) tree cover corrections whenever new AY data is available

// First delete the old asset projects/ee-mtpictd/assets/harsh/dw_corrected_{year-1}
// Now if AY 2023 is the new data, we need to correct 2022 and 2021's data.
// Set year = 2022 in that case and delete 2021's corrections

// If AY 2023's data is added, set year here to 2022
var year = 2022;

var agroclimatic_zone = 'Eastern Plateau & Hills Region';
// var agroclimatic_zone = 'Lower Gangetic Plain Region';
// var agroclimatic_zone = 'Middle Gangetic Plain Region';
// var agroclimatic_zone = 'Eastern Himalayan Region';
// var agroclimatic_zone = 'Western Himalayan Region';
// var agroclimatic_zone = 'Upper Gangetic Plain Region';
// var agroclimatic_zone = 'Trans Gangetic Plain Region';
// var agroclimatic_zone = 'Central Plateau & Hills Region';
// var agroclimatic_zone = 'Western Plateau and Hills Region';
// var agroclimatic_zone = 'Southern Plateau and Hills Region';
// var agroclimatic_zone = 'East Coast Plains & Hills Region';

// var agroclimatic_zone = 'West Coast Plains & Ghat Region';
// var agroclimatic_zone = 'Gujarat Plains & Hills Region';
// var agroclimatic_zone = 'Western Dry Region';

var agroclimaticZoneAcronymDict = {
  'Eastern Plateau & Hills Region': 'EPAHR',
  'Southern Plateau and Hills Region': 'SPAHR',
  'East Coast Plains & Hills Region': 'ECPHR',
  'Western Plateau and Hills Region': 'WPAHR',
  'Central Plateau & Hills Region': 'CPAHR',
  'Lower Gangetic Plain Region': 'LGPR',
  'Middle Gangetic Plain Region': 'MGPR',
  'Eastern Himalayan Region': 'EHR',
  'Western Himalayan Region': 'WHR',
  'Upper Gangetic Plain Region': 'UGPR',
  'Trans Gangetic Plain Region': 'TGPR',
  'West Coast Plains & Ghat Region': 'WCPGR',
  'Gujarat Plains & Hills Region': 'GPHR',
  'Western Dry Region': 'WDR'
};

var india_boundary = ee.FeatureCollection("projects/ee-mtpictd/assets/harsh/Agroclimatic_regions");
// print(india_boundary);
var aoi = india_boundary.filter(ee.Filter.eq('regionname', agroclimatic_zone)).geometry();
Map.addLayer(aoi);
Map.centerObject(aoi, 7);


var year_0 = String(year);
var year_0_suffix = year_0.slice(-2);

var year_1 = String(year+1);
var year_1_suffix = year_1.slice(-2);

var year_2 = String(year+2);
var year_2_suffix = year_2.slice(-2);

var year_1_n = String(year-1);
var year_1_n_suffix = year_1_n.slice(-2);

var year_2_n = String(year-2);
var year_2_n_suffix = year_2_n.slice(-2);

var year_3_n = String(year-3);
var year_3_n_suffix = year_3_n.slice(-2);

var start_date = year_0 + '-07-01';
var end_date = year_1 + '-06-30';
var tree_cover_0 = ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1")
  .filterDate(start_date, end_date)
  .filterBounds(aoi)
  .select('label')
  .mode()
  .clip(aoi);
tree_cover_0 = tree_cover_0.updateMask(tree_cover_0.eq(1));
tree_cover_0 = tree_cover_0.rename(['label_0']);

var start_date = year_1 + '-07-01';
var end_date = year_2 + '-06-30';
var tree_cover_1 = ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1")
  .filterDate(start_date, end_date)
  .filterBounds(aoi)
  .select('label')
  .mode()
  .clip(aoi);
tree_cover_1 = tree_cover_1.updateMask(tree_cover_1.eq(1));
tree_cover_1 = tree_cover_1.rename(['label_1']);

var start_date = year_1_n + '-07-01';
var end_date = year_0 + '-06-30';
var tree_cover_1_n = ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1")
  .filterDate(start_date, end_date)
  .filterBounds(aoi)
  .select('label')
  .mode()
  .clip(aoi);
tree_cover_1_n = tree_cover_1_n.updateMask(tree_cover_1_n.eq(1));
tree_cover_1_n = tree_cover_1_n.rename(['label_1_n']);

var start_date = year_2_n + '-07-01';
var end_date = year_1_n + '-06-30';
var tree_cover_2_n = ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1")
  .filterDate(start_date, end_date)
  .filterBounds(aoi)
  .select('label')
  .mode()
  .clip(aoi);
tree_cover_2_n = tree_cover_2_n.updateMask(tree_cover_2_n.eq(1));
tree_cover_2_n = tree_cover_2_n.rename(['label_2_n']);

var start_date = year_3_n + '-07-01';
var end_date = year_2_n + '-06-30';
var tree_cover_3_n = ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1")
  .filterDate(start_date, end_date)
  .filterBounds(aoi)
  .select('label')
  .mode()
  .clip(aoi);
tree_cover_3_n = tree_cover_3_n.updateMask(tree_cover_3_n.eq(1));
tree_cover_3_n = tree_cover_3_n.rename(['label_3_n']);

// DW correction year-1
var tree_cover = tree_cover_3_n.addBands(tree_cover_2_n).addBands(tree_cover_1_n)
  .addBands(tree_cover_0).addBands(tree_cover_1);
tree_cover = tree_cover.unmask(-9999);
tree_cover = tree_cover.expression(
    "((b('label_3_n')!=-9999) and (b('label_2_n')!=-9999) and (b('label_1_n')==-9999) and (b('label_0')!=-9999) and (b('label_1')!=-9999)) ? (b('label_3_n'))"+
    ":b('label_1_n')"
  ).clip(aoi);
tree_cover = tree_cover.updateMask(tree_cover.neq(-9999));
tree_cover = tree_cover.rename(['label_' + year_1_n_suffix]);
Export.image.toAsset({
  image: tree_cover,
  description: 'dw_corrected_' + year_1_n + '_' + agroclimaticZoneAcronymDict[agroclimatic_zone],
  assetId: 'projects/ee-mtpictd/assets/harsh/dw_corrected_' + year_1_n + '/' + agroclimaticZoneAcronymDict[agroclimatic_zone],
  region: aoi,
  scale: 10,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});

Map.addLayer(tree_cover, {palette: ['white']}, 'tree cover curr year - 1');

// DW correction year
var tree_cover = tree_cover_2_n.addBands(tree_cover_1_n).addBands(tree_cover_0)
  .addBands(tree_cover_1);
tree_cover = tree_cover.unmask(-9999);
tree_cover = tree_cover.expression(
    "((b('label_2_n')!=-9999) and (b('label_1_n')!=-9999) and (b('label_0')==-9999) and (b('label_1')!=-9999)) ? (b('label_2_n'))"+
    ":b('label_0')"
  ).clip(aoi);
tree_cover = tree_cover.updateMask(tree_cover.neq(-9999));
tree_cover = tree_cover.rename(['label_' + year_0_suffix]);
Export.image.toAsset({
  image: tree_cover,
  description: 'dw_corrected_' + year_0 + '_' + agroclimaticZoneAcronymDict[agroclimatic_zone],
  assetId: 'projects/ee-mtpictd/assets/harsh/dw_corrected_' + year_0 + '/' + agroclimaticZoneAcronymDict[agroclimatic_zone],
  region: aoi,
  scale: 10,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});

Map.addLayer(tree_cover, {palette: ['white']}, 'tree cover curr year');
