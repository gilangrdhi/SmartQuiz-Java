package com.smartquiz.smartquiz_api.dto; // Sesuaikan package

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class QuizResultRequest {
    private Long userId;
    private Integer earnedPoints;
    
    @JsonProperty("isWin")
    private Boolean isWin;
    
    private List<String> usedBuffs;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getEarnedPoints() { return earnedPoints; }
    public void setEarnedPoints(Integer earnedPoints) { this.earnedPoints = earnedPoints; }

    public Boolean getIsWin() { return isWin; }
    public void setIsWin(Boolean isWin) { this.isWin = isWin; }

    public List<String> getUsedBuffs() { return usedBuffs; }
    public void setUsedBuffs(List<String> usedBuffs) { this.usedBuffs = usedBuffs; }
}