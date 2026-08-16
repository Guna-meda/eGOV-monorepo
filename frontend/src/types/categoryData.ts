// categoryData.ts

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

//hard coded categories and subcategories from RAINMAKER-PGR.json, fetch from MDMS in future
export const categories: Category[] = 
[
  {
    "id": "Garbage",
    "name": "Garbage",
    "subcategories": [
      {
        "id": "AbsenteeismOfDoorToDoorGarbageCollector",
        "name": "Absenteeism of Door to door garbage Collector"
      },
      {
        "id": "AbsenteeismOfSweepers",
        "name": "Absenteeism of Sweepers"
      },
      {
        "id": "AvailabilityOrCleanlinessOfDustbinsInPublicToilets",
        "name": "Availability or cleanliness of dustbins in public toilets"
      },
      {
        "id": "BiomedicalWasteHealthHazardWasteRemoval",
        "name": "Biomedical waste / Health hazard waste removal"
      },
      {
        "id": "BrokenBin",
        "name": "Broken Bin"
      },
      {
        "id": "BurningOfGarbage",
        "name": "Burning of Garbage"
      },
      {
        "id": "BurningOfGarbageAtDumpingGround",
        "name": "Burning of Garbage at Dumping Ground"
      },
      {
        "id": "ComplaintsRegardingPlastics",
        "name": "Complaints Regarding Plastics"
      },
      {
        "id": "FliesMenaceFromDumpingGround",
        "name": "Flies Menace from Dumping Ground"
      },
      {
        "id": "GarbageLorryWithoutNet",
        "name": "Garbage Lorry without Net"
      },
      {
        "id": "ImproperSweeping",
        "name": "Improper Sweeping"
      },
      {
        "id": "NuisanceByGarbageTractorTruck",
        "name": "Nuisance by Garbage Tractor/Truck"
      },
      {
        "id": "OverflowingOfGarbageBin",
        "name": "Overflowing of Garbage Bin"
      },
      {
        "id": "ProvisonOfGarbageBin",
        "name": "Provison of Garbage Bin"
      },
      {
        "id": "RemovalOfGarbage",
        "name": "Removal of Garbage"
      },
      {
        "id": "ShiftingOfGarbageBin",
        "name": "Shifting of Garbage Bin"
      },
      {
        "id": "SpillingOfGarbageFromLorry",
        "name": "Spilling of Garbage from Lorry"
      },
      {
        "id": "TransferStationSmell",
        "name": "Transfer Station Smell"
      }
    ]
  },
  {
    "id": "Roads",
    "name": "Roads",
    "subcategories": [
      {
        "id": "AdvanceInformationOnConsultationNotProvidedThiruvotriyurHighRoad",
        "name": "Advance information on consultation not provided (Thiruvotriyur High Road)"
      },
      {
        "id": "CleanlinessInFootpath",
        "name": "Cleanliness in footpath"
      },
      {
        "id": "ComplaintsRegardingBridgesFlyoversSubways",
        "name": "Complaints regarding Bridges / Flyovers / Subways"
      },
      {
        "id": "ComplaintsRegardingCentreMedian",
        "name": "Complaints regarding Centre Median"
      },
      {
        "id": "ComplaintsRegardingTrafficIsland",
        "name": "Complaints regarding Traffic Island"
      },
      {
        "id": "DamageToUtilitiesTnebCmwssbBsnlKhadarNawasKhanRoad",
        "name": "Damage to utilities (TNEB, CMWSSB, BSNL) (Khadar Nawas Khan Road)"
      },
      {
        "id": "DamageToUtilitiesTnebCmwssbBsnlRaceCourseRoadGuindyMmi",
        "name": "Damage to utilities (TNEB, CMWSSB, BSNL) (Race Course road + Guindy MMI)"
      },
      {
        "id": "DamageToUtilitiesTnebCmwssbBsnlThiruvotriyurHighRoad",
        "name": "Damage to utilities (TNEB, CMWSSB, BSNL) (Thiruvotriyur High Road)"
      },
      {
        "id": "DamageToUtilitiesTnebCmwssbBsnlWashermenpetMetro",
        "name": "Damage to utilities (TNEB, CMWSSB, BSNL) (Washermenpet Metro)"
      },
      {
        "id": "DisposalOfDebrisNotAppropriatelyManagedArunachaleshwarRoad",
        "name": "Disposal of debris not appropriately managed (Arunachaleshwar Road)"
      },
      {
        "id": "DisposalOfDebrisNotAppropriatelyManagedRaceCourseRoadGuindyMmi",
        "name": "Disposal of debris not appropriately managed (Race Course road + Guindy MMI)"
      },
      {
        "id": "ElectricalWiresObstructionOnFootpath",
        "name": "Electrical wires/obstruction on footpath"
      },
      {
        "id": "ElectricitySupplyDisruptedAndAlternateArrangementNotProvidedRaceCourseRoadGuindyMmi",
        "name": "Electricity supply disrupted and alternate arrangement not provided (Race Course road + Guindy MMI)"
      },
      {
        "id": "EncroachingPublicSpaceArunachaleshwarRoad",
        "name": "Encroaching Public Space (Arunachaleshwar Road)"
      },
      {
        "id": "EncroachingPublicSpaceKhadarNawasKhanRoad",
        "name": "Encroaching Public Space (Khadar Nawas Khan Road)"
      },
      {
        "id": "EncroachingPublicSpaceMcRoad",
        "name": "Encroaching Public Space (MC Road)"
      },
      {
        "id": "EncroachingPublicSpaceRaceCourseRoadGuindyMmi",
        "name": "Encroaching Public Space (Race Course road + Guindy MMI)"
      },
      {
        "id": "EncroachingPublicSpaceThiruvotriyurHighRoad",
        "name": "Encroaching Public Space (Thiruvotriyur High Road)"
      },
      {
        "id": "FormationOfNewRoad",
        "name": "Formation of New Road"
      },
      {
        "id": "IllegalParkingOnFootPath",
        "name": "Illegal Parking on foot path"
      },
      {
        "id": "InformationOnDetailedWorkPlanNotProvidedArunachaleshwarRoad",
        "name": "Information on detailed work plan not provided (Arunachaleshwar Road)"
      },
      {
        "id": "InformationOnDetailedWorkPlanNotProvidedRaceCourseRoadGuindyMmi",
        "name": "Information on detailed work plan not provided (Race Course road + Guindy MMI)"
      },
      {
        "id": "InsufficientBarricading",
        "name": "Insufficient Barricading"
      },
      {
        "id": "InsufficientBarricadingArunachaleshwarRoad",
        "name": "Insufficient Barricading (Arunachaleshwar Road)"
      },
      {
        "id": "InsufficientBarricadingKhadarNawasKhanRoad",
        "name": "Insufficient Barricading (Khadar Nawas Khan Road)"
      },
      {
        "id": "InsufficientBarricadingMcRoad",
        "name": "Insufficient Barricading (MC Road)"
      },
      {
        "id": "InsufficientBarricadingThiruvotriyurHighRoad",
        "name": "Insufficient Barricading (Thiruvotriyur High Road)"
      },
      {
        "id": "LocationAndAreaOfConsultationNotProvidedThiruvotriyurHighRoad",
        "name": "Location and area of consultation not provided (Thiruvotriyur High Road)"
      },
      {
        "id": "MillingScrapingOfRoadBeforeRelayingOfRoad",
        "name": "Milling/Scraping of Road before Relaying of Road"
      },
      {
        "id": "NeedPathwayRampMcRoad",
        "name": "Need Pathway ramp (MC Road)"
      },
      {
        "id": "NeedPathwayRampThiruvotriyurHighRoad",
        "name": "Need Pathway ramp (Thiruvotriyur High Road)"
      },
      {
        "id": "NoInformationInAdvanceProvidedOnTheDateAndTimeOfCivilWorksMcRoad",
        "name": "No information in advance provided on the date and time of civil works (MC Road)"
      },
      {
        "id": "NoInformationInAdvanceProvidedOnTheDateAndTimeOfCivilWorksThiruvotriyurHighRoad",
        "name": "No information in advance provided on the date and time of civil works (Thiruvotriyur High Road)"
      },
      {
        "id": "NoInformationInAdvanceProvidedOnTheDateAndTimeOfCivilWorksWashermenpetMetro",
        "name": "No information in advance provided on the date and time of civil works (Washermenpet Metro)"
      },
      {
        "id": "NoInformationOnNumberOfLabourWorkingAtTheSiteMcRoad",
        "name": "No information on number of labour working at the site (MC Road)"
      },
      {
        "id": "NoSafetyMeasuresTakenAtWorksiteThiruvotriyurHighRoad",
        "name": "No safety measures taken at worksite (Thiruvotriyur High Road)"
      },
      {
        "id": "NoiseLevelsAreVeryHighArunachaleshwarRoad",
        "name": "Noise levels are very high (Arunachaleshwar Road)"
      },
      {
        "id": "NoiseLevelsAreVeryHighKhadarNawasKhanRoad",
        "name": "Noise levels are very high (Khadar Nawas Khan Road)"
      },
      {
        "id": "NoiseLevelsAreVeryHighMcRoad",
        "name": "Noise levels are very high (MC Road)"
      },
      {
        "id": "NoiseLevelsAreVeryHighRaceCourseRoadGuindyMmi",
        "name": "Noise levels are very high (Race Course road + Guindy MMI)"
      },
      {
        "id": "NonRemovalOfDebrisKhadarNawasKhanRoad",
        "name": "Non Removal of Debris (Khadar Nawas Khan Road)"
      },
      {
        "id": "NonRemovalOfDebrisMcRoad",
        "name": "Non Removal of Debris (MC Road)"
      },
      {
        "id": "NonRemovalOfDebrisThiruvotriyurHighRoad",
        "name": "Non Removal of Debris (Thiruvotriyur High Road)"
      },
      {
        "id": "OthersMcRoad",
        "name": "Others (MC Road)"
      },
      {
        "id": "OthersWashermenpetMetro",
        "name": "Others (Washermenpet Metro)"
      },
      {
        "id": "ParkingIssue",
        "name": "Parking Issue"
      },
      {
        "id": "PoorQualityOfWork",
        "name": "Poor Quality of Work"
      },
      {
        "id": "PotHoleFillUpRepairsToTheDamagedSurface",
        "name": "Pot hole fill up / Repairs to the damaged surface"
      },
      {
        "id": "PotholesFillUpThiruvotriyurHighRoad",
        "name": "Potholes fill up (Thiruvotriyur High Road)"
      },
      {
        "id": "ProjectInformationNotProvidedWashermenpetMetro",
        "name": "Project information not provided (Washermenpet Metro)"
      },
      {
        "id": "RelayingOfRoad",
        "name": "Relaying of Road"
      },
      {
        "id": "RemovalOfDebris",
        "name": "Removal of Debris"
      },
      {
        "id": "RemovalOfShopsInTheFootpath",
        "name": "Removal of Shops in the Footpath"
      },
      {
        "id": "RepairsToExistingFootpath",
        "name": "Repairs to existing Footpath"
      },
      {
        "id": "RequestToProvideFootpath",
        "name": "Request to provide Footpath"
      },
      {
        "id": "SlowProgressOfWork",
        "name": "Slow Progress of Work"
      },
      {
        "id": "WaterSupplyDisruptedAndAlternateArrangementNotProvidedRaceCourseRoadGuindyMmi",
        "name": "Water supply disrupted and alternate arrangement not provided (Race Course road + Guindy MMI)"
      }
    ]
  },
  {
    "id": "PublicHealth",
    "name": "PublicHealth",
    "subcategories": [
      {
        "id": "AirQuality",
        "name": "Air Quality"
      },
      {
        "id": "ComplaintsRegardingCdh",
        "name": "Complaints regarding CDH"
      },
      {
        "id": "ComplaintsRegardingCorporationHospitals",
        "name": "Complaints regarding Corporation Hospitals"
      },
      {
        "id": "ComplaintsRegardingLaboratoryIssues",
        "name": "Complaints regarding laboratory issues"
      },
      {
        "id": "ComplaintsRegardingNonAvailabilityOfDoctors",
        "name": "Complaints regarding non availability of Doctors"
      },
      {
        "id": "ComplaintsRegardingNonAvailabilityOfMedicines",
        "name": "Complaints regarding non availability of medicines"
      },
      {
        "id": "Covid19AmbulanceService",
        "name": "Covid19 Ambulance Service"
      },
      {
        "id": "DeathOfStrayAnimals",
        "name": "Death of Stray Animals"
      },
      {
        "id": "IssuesRegardingAmmaNutritionKitForPregnantWoman",
        "name": "Issues regarding Amma nutrition kit for pregnant woman"
      },
      {
        "id": "IssuesRegardingMuthulakshmiReddyMaternityBenefitSchemeMrmbs",
        "name": "Issues regarding Muthulakshmi Reddy Maternity Benefit Scheme (MRMBS)"
      },
      {
        "id": "IssuesRegardingAmmaBabyCareKitsAfterDelivery",
        "name": "Issues regarding amma baby care kits (After Delivery)"
      },
      {
        "id": "IssuesRegardingJananiSurakshaYojanaSchemeJsy",
        "name": "Issues regarding janani suraksha yojana scheme (JSY)"
      },
      {
        "id": "MosquitoMenace",
        "name": "Mosquito Menace"
      },
      {
        "id": "PublicHealthDengueMalariaGastroEnteritis",
        "name": "Public Health / Dengue / Malaria / Gastro Enteritis"
      },
      {
        "id": "PublicHealthDengueMalariaGastroEnteritisO",
        "name": "Public Health/Dengue/Malaria/Gastro-enteritis(O)"
      },
      {
        "id": "StrayCattle",
        "name": "Stray Cattle"
      },
      {
        "id": "StrayPigs",
        "name": "Stray Pigs"
      },
      {
        "id": "StreetDogs",
        "name": "Street Dogs"
      }
    ]
  },
  {
    "id": "Sanitation",
    "name": "Sanitation",
    "subcategories": [
      {
        "id": "BrokenSinksToiletsOrUrinalsAndDoors",
        "name": "Broken sinks, toilets or urinals and doors"
      },
      {
        "id": "ComplaintsRegardingCleanlinessOfToiletsInShoppingComplex",
        "name": "Complaints regarding Cleanliness of Toilets in Shopping Complex"
      },
      {
        "id": "ComplaintsRegardingCleanlinessOfToiletsInTheatre",
        "name": "Complaints regarding Cleanliness of Toilets in Theatre"
      },
      {
        "id": "ComplaintsRegardingFreeUsageOfPublicToilets",
        "name": "Complaints regarding Free Usage of Public Toilets"
      },
      {
        "id": "ComplaintsRegardingPublicToilets",
        "name": "Complaints regarding Public Toilets"
      },
      {
        "id": "ComplaintsRegardingQualityOfFoodInHotels",
        "name": "Complaints regarding quality of food in hotels"
      },
      {
        "id": "ComplaintsRegardingUnhygenicRestaurants",
        "name": "Complaints regarding unhygenic Restaurants"
      },
      {
        "id": "FoodRequirement",
        "name": "Food Requirement"
      },
      {
        "id": "FoodRelatedComplaints",
        "name": "Food related complaints"
      },
      {
        "id": "IllegalSlaughtering",
        "name": "Illegal Slaughtering"
      },
      {
        "id": "IllegalActivitiesInToilet",
        "name": "Illegal activities in toilet"
      },
      {
        "id": "NoElectricityInPublicToilet",
        "name": "No electricity in public toilet"
      },
      {
        "id": "OpenDefecation",
        "name": "Open Defecation"
      },
      {
        "id": "PublicDefecationUrination",
        "name": "Public defecation/urination"
      },
      {
        "id": "PublicToiletBlockage",
        "name": "Public toilet blockage"
      },
      {
        "id": "PublicToiletCleaning",
        "name": "Public toilet cleaning"
      },
      {
        "id": "RequestForNewToilet",
        "name": "Request for new toilet"
      },
      {
        "id": "SafetyInPublicToilets",
        "name": "Safety in public toilets"
      },
      {
        "id": "SlaughterHouseRelatedComplaints",
        "name": "Slaughter House related complaints"
      },
      {
        "id": "ToiletsInParks",
        "name": "Toilets in parks"
      },
      {
        "id": "ToiletsNotInUseClosed",
        "name": "Toilets not in use/ closed"
      },
      {
        "id": "UnauthorizedSaleOfMeatAndMeatProducts",
        "name": "Unauthorized Sale of Meat and Meat products"
      },
      {
        "id": "UnhygenicAndImproperTransportOfMeatAndLivestock",
        "name": "Unhygenic and Improper Transport of Meat and Livestock"
      }
    ]
  },
  {
    "id": "BuildingSafety",
    "name": "BuildingSafety",
    "subcategories": [
      {
        "id": "BuildingPlanSanction",
        "name": "Building Plan Sanction"
      },
      {
        "id": "EncroachmentOnThePublicProperty",
        "name": "Encroachment on the Public Property"
      },
      {
        "id": "FallenPolesTowersHoardingsOtherInfra",
        "name": "Fallen poles/towers/hoardings/other infra"
      },
      {
        "id": "OverheadCableWiresRunningInAHaphazardManner",
        "name": "Overhead cable wires running in a haphazard manner"
      },
      {
        "id": "UnauthorizedIllegalConstruction",
        "name": "Unauthorized / Illegal Construction"
      },
      {
        "id": "UnauthorizedAdvertisementBoards",
        "name": "Unauthorized Advertisement Boards"
      },
      {
        "id": "UnauthorizedTreeCutting",
        "name": "Unauthorized Tree Cutting"
      },
      {
        "id": "ViolationOfDcrBuildingByLaws",
        "name": "Violation of DCR/Building By laws"
      }
    ]
  },
  {
    "id": "StreetLights",
    "name": "StreetLights",
    "subcategories": [
      {
        "id": "BurningOfStreetLightInDaytime",
        "name": "Burning of street light in daytime"
      },
      {
        "id": "DamageToTheElectricPole",
        "name": "Damage to the Electric pole"
      },
      {
        "id": "ElectricShockDueToStreetLight",
        "name": "Electric shock due to street light"
      },
      {
        "id": "ElectricityShock",
        "name": "Electricity Shock"
      },
      {
        "id": "ElectricityUnavailability",
        "name": "Electricity Unavailability"
      },
      {
        "id": "FallenEbCables",
        "name": "Fallen EB cables"
      },
      {
        "id": "InadequateLightInAParticularLocationOrSpotDarkSpots",
        "name": "Inadequate light in a particular location or spot/ dark spots"
      },
      {
        "id": "InadequateLightingInAndAroundTheToilet",
        "name": "Inadequate lighting in and around the toilet"
      },
      {
        "id": "NewStreetLights",
        "name": "New Street lights"
      },
      {
        "id": "NonBurningOfStreetLights",
        "name": "Non burning of Street lights"
      },
      {
        "id": "NonFunctionalLightsNoLightsInParks",
        "name": "Non functional lights/ no lights in parks"
      },
      {
        "id": "ShiftingOfStreetLightPole",
        "name": "Shifting of Street light pole"
      },
      {
        "id": "UnsafeDarkSpotsCorners",
        "name": "Unsafe dark spots/ corners"
      }
    ]
  },
  {
    "id": "General",
    "name": "General",
    "subcategories": [
      {
        "id": "ChangeOfAddressInElectoralRoll",
        "name": "Change of Address in Electoral Roll"
      },
      {
        "id": "CleanlinessInParks",
        "name": "Cleanliness in Parks"
      },
      {
        "id": "ComplaintsRegardingBurialGround",
        "name": "Complaints regarding Burial Ground"
      },
      {
        "id": "ComplaintsRegardingCommunityHall",
        "name": "Complaints regarding Community Hall"
      },
      {
        "id": "ComplaintsRegardingPark",
        "name": "Complaints regarding Park"
      },
      {
        "id": "ComplaintsRegardingPlayground",
        "name": "Complaints regarding Playground"
      },
      {
        "id": "ComplaintsRegardingVoterList",
        "name": "Complaints regarding Voter List"
      },
      {
        "id": "ComplaintsRegardingAnyOtherCocBuilding",
        "name": "Complaints regarding any other CoC building"
      },
      {
        "id": "ComplaintsRegardingBurialGroundO",
        "name": "Complaints regarding burial ground(O)"
      },
      {
        "id": "ComplaintsRelatedToProfessionalTax",
        "name": "Complaints related to Professional Tax"
      },
      {
        "id": "ComplaintsRelatedToPropertyTax",
        "name": "Complaints related to Property Tax"
      },
      {
        "id": "ComplaintsRelatedToSchools",
        "name": "Complaints related to Schools"
      },
      {
        "id": "ComplaintsRelatedToIssueOfAllTypesOfRegistrationCertificate",
        "name": "Complaints related to issue of all types of Registration Certificate"
      },
      {
        "id": "GeneralRevisionObjection",
        "name": "General Revision Objection"
      },
      {
        "id": "GreenaryInParks",
        "name": "Greenary in Parks"
      },
      {
        "id": "InclusionDeletionCorrectionInVoterList",
        "name": "Inclusion, Deletion, Correction in Voter List"
      },
      {
        "id": "IssueOfBirthAndDeathCertificate",
        "name": "Issue of Birth and Death Certificate"
      },
      {
        "id": "IssueOfVoterId",
        "name": "Issue of Voter ID"
      },
      {
        "id": "NameErrorSpellingRelated",
        "name": "Name Error (Spelling Related)"
      },
      {
        "id": "NameNotFoundInTheElectoralRoll",
        "name": "Name not found in the Electoral Roll"
      },
      {
        "id": "ObstructionOfTrees",
        "name": "Obstruction of Trees"
      },
      {
        "id": "OnlinePaymentIssue",
        "name": "Online Payment Issue"
      },
      {
        "id": "OpeningAndClosingHours",
        "name": "Opening and closing hours"
      },
      {
        "id": "Others",
        "name": "Others"
      },
      {
        "id": "PlayEquipment",
        "name": "Play Equipment"
      },
      {
        "id": "ReliefCenterRequirement",
        "name": "Relief Center Requirement"
      },
      {
        "id": "RemovalOfFallenTrees",
        "name": "Removal of Fallen Trees"
      },
      {
        "id": "SafetyInParksPlaygrounds",
        "name": "Safety in parks/playgrounds"
      },
      {
        "id": "SanctionOfFinancialAssistanceUnderMoovalaurThirumanaThittam",
        "name": "Sanction of Financial Assistance under Moovalaur Thirumana Thittam"
      },
      {
        "id": "WomenRelatedSafetyIssues",
        "name": "Women related safety issues"
      },
      {
        "id": "WomenRelatedSafetyIssuesInParks",
        "name": "Women related safety issues in parks"
      }
    ]
  },
  {
    "id": "Drainage",
    "name": "Drainage",
    "subcategories": [
      {
        "id": "CleaningOfWaterTable",
        "name": "Cleaning of Water Table"
      },
      {
        "id": "CoveringManholesOfStormWaterDrain",
        "name": "Covering Manholes of Storm Water Drain"
      },
      {
        "id": "DesiltingOfCanal",
        "name": "Desilting of Canal"
      },
      {
        "id": "DesiltingOfDrain",
        "name": "Desilting of Drain"
      },
      {
        "id": "DisposalOfRemovedSiltOnTheRoad",
        "name": "Disposal of Removed Silt on the Road"
      },
      {
        "id": "IllegalDrainingOfSewageToSwdOpenSite",
        "name": "Illegal Draining of Sewage to SWD / Open Site"
      },
      {
        "id": "NewDrainConstruction",
        "name": "New Drain Construction"
      },
      {
        "id": "ObstructionOfWaterFlow",
        "name": "Obstruction of Water Flow"
      },
      {
        "id": "RepairsToStormWaterDrain",
        "name": "Repairs to Storm Water Drain"
      },
      {
        "id": "SewerageOverflow",
        "name": "Sewerage Overflow"
      },
      {
        "id": "StagnationOfWater",
        "name": "Stagnation of Water"
      },
      {
        "id": "WaterMixedWithSewarage",
        "name": "Water Mixed with Sewarage"
      }
    ]
  },
  {
    "id": "WaterSupply",
    "name": "WaterSupply",
    "subcategories": [
      {
        "id": "CleanlinessWaterSupplyInToilets",
        "name": "Cleanliness/ water supply in toilets"
      },
      {
        "id": "DrinkingWaterSupply",
        "name": "Drinking water supply"
      },
      {
        "id": "NoWaterSupplyInPublicToilet",
        "name": "No water supply in public toilet"
      }
    ]
  },
  {
    "id": "Markets",
    "name": "Markets",
    "subcategories": [
      {
        "id": "ComplaintsRelatedShoppingComplex",
        "name": "Complaints related Shopping Complex"
      },
      {
        "id": "ComplaintsRelatedToTradeLicence",
        "name": "Complaints related to Trade Licence"
      },
      {
        "id": "RoadSideEateries",
        "name": "Road Side Eateries"
      }
    ]
  }
]
/**
 * Returns every category.
 * Later this can be replaced with an API call.
 */
export function getCategories(): Category[] {
  return categories;
}

/**
 * Returns a single category by id.
 */
export function getCategory(categoryId: string): Category | undefined {
  return categories.find(category => category.id === categoryId);
}

/**
 * Returns the subcategories for a category.
 */
export function getSubcategories(categoryId: string): Subcategory[] {
  return (
    categories.find(category => category.id === categoryId)?.subcategories ??
    []
  );
}