#potentially useful imports
from geopandas import geopandas as gpd
from rasterio import rasterio as rio
from numpy import numpy as np
from gdal import gdal as gdal

#imports of self-written models
from .models import Point


#this function should take in a geotiff as a blob first, and then a list of points (Point model) m

#This function should take in a geotiff as a blob first, and then a list of points (Point model) minimum 3 points, and then return the geotiff with the gcp points added to it.







#function to add 3 or more gcp (ground control point) to image (gtiff as blob), inital triangulation
def add_gcp(image: bytes, points: list[Point]):
    #check for minimum 3 points
    if len(points) < 3:
        return None
    #create rasterio dataset from image
    ds = rio.open(image)
    #create gdal dataset from rasterio dataset
    gds = gdal.Open(ds)
    #create gdal geotransform from gdal dataset
    gt = gds.GetGeoTransform()
    #create gdal spatial reference from gdal dataset
    srs = gds.GetSpatialRef()
    #create gdal gcp list from points
    gcps = [gdal.GCP(point.longitude, point.latitude, 0, point.x, point.y) for point in points]
    #set gcps to gdal dataset
    gds.SetGCPs(gcps, srs.ExportToWkt())
    #create gdal warp options
    warp_options = gdal.WarpOptions(format='GTiff', geoloc=True, outputBounds=[gt[0], gt[3], gt[0] + gt[1] * ds.width, gt[3] + gt[5] * ds.height], outputBoundsSRS=srs)
    #create gdal dataset from gdal dataset and warp options
    gds = gdal.Warp('', gds, options=warp_options)
    #create rasterio dataset from gdal dataset
    ds = rio.open(gds)
    #create geodataframe from points
    gdf = gpd.GeoDataFrame(points, geometry=gpd.points_from_xy(points.longitude, points.latitude))
    #set crs of geodataframe to crs of rasterio dataset
    gdf.crs = ds.crs
    #return geodataframe
    return gdf
