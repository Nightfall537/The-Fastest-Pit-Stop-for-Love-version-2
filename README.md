
# 🌾 Parametric Crop Insurance Platform — Improving Crop Insurance Using Big Data in Rural Areas

> A Big Data and Machine Learning project for predicting agricultural losses from 
> weather events using satellite-derived indices and historical climate data.

[![Live Dashboard](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://crop-insurance-dashboard-qyfzle64sj9hibkqmgs3jq.streamlit.app/)

---

## 📌 Project Context


**Course:** Advanced Big Data Management 
**Programme:** MSc Internet of Things & Big Data  
**Institution:** Ghana Communication Technology University  
**Academic Year:** 2025/2026  

---

## 🔍 The Problem

Smallholder farmers in rural Ghana — and across Sub-Saharan Africa broadly — are among the most economically vulnerable populations in the world. Their livelihoods depend almost entirely on rain-fed agriculture, yet they operate with virtually no financial safety net against weather shocks.

**Conventional crop insurance has failed this demographic for three structural reasons:**

### 1. Verification Dependency
Traditional indemnity-based insurance requires physical field inspections to verify crop losses before any payout is made. In rural Ghana, where road infrastructure is limited and farm plots are geographically dispersed, this process is prohibitively expensive, slow, and logistically impractical. By the time an assessment is completed, the farming household has already incurred irreversible financial damage.

### 2. Data Scarcity
Actuarial pricing of agricultural insurance requires robust historical yield and loss data. Most smallholder farms in Sub-Saharan Africa lack formal records. Government and institutional yield databases are sparse, inconsistent, or inaccessible — making it impossible for commercial insurers to price risk accurately. This data gap causes insurers to either price premiums too high for farmers to afford, or exit the market entirely.

### 3. Basis Risk
Even where insurance products exist, they often fail to reflect localised weather conditions. A national or regional average rainfall figure may show adequate rainfall for a given season while specific farming districts experience severe drought. Farmers receive no payout despite real losses — eroding trust and product uptake.

**The result:** Ghana's agricultural insurance penetration remains critically low. The Ghana Agricultural Insurance Pool (GAIP) serves only a fraction of the farming population. When droughts, floods, or erratic rainfall destroy harvests, farmers have no recourse — pushing rural households deeper into poverty cycles and discouraging agricultural investment.

---

## 💡 The Solution

This project proposes a **Parametric Crop Insurance Platform** — a shift away from loss verification toward objective, data-driven, index-based triggers.

Rather than asking *"did this farmer's crops fail?"*, the system asks *"did the rainfall index in this district breach a predefined threshold?"*. If yes, a payout is automatically triggered. No inspector. No field visit. No delay.

**The core mechanism works as follows:**

Satellite-derived rainfall data from CHIRPS (Climate Hazards Group InfraRed Precipitation with Station data) is processed at the district level across Ghana's 260 administrative districts. For each district, a rainfall anomaly is computed — measuring how much current-season rainfall deviated from the long-term climatological mean. When this anomaly falls below −25% (indicating significant drought stress) or when standardised hazard indices from the Humanitarian Data Exchange cross defined thresholds, an insurance payout is automatically triggered for all enrolled farmers in that district.

A machine learning model (XGBoost) was trained on this multi-source dataset to predict district-level drought risk probability, incorporating not just rainfall signals but also soil properties — because identical rainfall deficits produce very different crop outcomes on different soils. A sandy, nitrogen-poor soil amplifies drought damage far more severely than deep, organically rich soil.

The platform visualises risk across Ghana through an interactive choropleth dashboard, allowing insurers, policymakers, and agricultural bodies to monitor live drought risk, adjust payout thresholds, and simulate total payout exposure for any given season.

---

## 🎯 Project Objectives

The project was structured around six core objectives:

**Objective 1 — Establish the Problem and Use Case**  
Define a scientifically grounded, academically defensible problem statement around crop insurance failure in rural Ghana. Identify the specific use case (parametric loss prediction) and justify why big data technologies are necessary — not merely useful — for solving it.

**Objective 2 — Identify and Acquire Relevant Datasets**  
Source multi-domain datasets that collectively capture the key drivers of agricultural drought risk. This included satellite rainfall rasters (CHIRPS), subnational rainfall hazard indices (HDX), soil quality data (iSDA), and administrative boundary files (GADM / COD-AB). A deliberate focus was placed on freely available, open-access data to demonstrate real-world replicability without institutional data access.

**Objective 3 — Design a Scalable Big Data Architecture**  
Propose and implement a system architecture that reflects genuine big data principles — ingestion from heterogeneous sources, raster processing at scale, spatial data engineering, feature store design, and model serving. The architecture was iteratively revised to match the actual available dataset, replacing planned
```
