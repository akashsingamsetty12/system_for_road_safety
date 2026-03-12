package com.example.backend.model;

public class Location {
    private int id;
    private String area;
    private int issues;
    private String lat;
    private String lng;
    private String severity;
    private String roadType;
    private int potholes;
    private int cracks;
    private String status;

    public Location(int id, String area, int issues, String lat, String lng) {
        this.id = id;
        this.area = area;
        this.issues = issues;
        this.lat = lat;
        this.lng = lng;
        this.severity = "Moderate";
        this.roadType = "Local Road";
        this.potholes = 5;
        this.cracks = 10;
        this.status = "Open";
    }

    public Location(int id, String area, int issues, String lat, String lng, String severity, 
                    String roadType, int potholes, int cracks, String status) {
        this.id = id;
        this.area = area;
        this.issues = issues;
        this.lat = lat;
        this.lng = lng;
        this.severity = severity;
        this.roadType = roadType;
        this.potholes = potholes;
        this.cracks = cracks;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public int getIssues() {
        return issues;
    }

    public void setIssues(int issues) {
        this.issues = issues;
    }

    public String getLat() {
        return lat;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }

    public String getLng() {
        return lng;
    }

    public void setLng(String lng) {
        this.lng = lng;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getRoadType() {
        return roadType;
    }

    public void setRoadType(String roadType) {
        this.roadType = roadType;
    }

    public int getPotholes() {
        return potholes;
    }

    public void setPotholes(int potholes) {
        this.potholes = potholes;
    }

    public int getCracks() {
        return cracks;
    }

    public void setCracks(int cracks) {
        this.cracks = cracks;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
