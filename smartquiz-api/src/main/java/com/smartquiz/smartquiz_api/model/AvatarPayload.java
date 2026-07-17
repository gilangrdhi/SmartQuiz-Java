package com.smartquiz.smartquiz_api.model;

public class AvatarPayload {
    private String color;
    private String hatId;
    private int hatPositionX;
    private int hatPositionY;
    private int hatWidth;
    private int hatHeight;
    private int hatRotation;

    // Kalau kamu pakai library Lombok, kamu bisa hapus semua Getter & Setter di bawah ini 
    // dan cukup tambahkan anotasi @Data di atas nama class.

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getHatId() { return hatId; }
    public void setHatId(String hatId) { this.hatId = hatId; }

    public int getHatPositionX() { return hatPositionX; }
    public void setHatPositionX(int hatPositionX) { this.hatPositionX = hatPositionX; }

    public int getHatPositionY() { return hatPositionY; }
    public void setHatPositionY(int hatPositionY) { this.hatPositionY = hatPositionY; }

    public int getHatWidth() { return hatWidth; }
    public void setHatWidth(int hatWidth) { this.hatWidth = hatWidth; }

    public int getHatHeight() { return hatHeight; }
    public void setHatHeight(int hatHeight) { this.hatHeight = hatHeight; }

    public int getHatRotation() { return hatRotation; }
    public void setHatRotation(int hatRotation) { this.hatRotation = hatRotation; }
}