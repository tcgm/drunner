using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEngine;

public enum Rarity
{
    Abundant,
    Common,
    Uncommon,
    Rare,
    VeryRare,
    Magical,
    Elite,
    Epic,
    Legendary,
    Mythic,
    Mythicc,
    Artifact,
    Divine,
    Celestial,
    RealityAnchor,
    Structural,
    Singularity,
    Void,
    Elder,
    Layer,
    Plane,
    Author
}


[Serializable]
public class RarityConfig
{
    public Rarity Rarity;
    public float Percentage;
}

public static class RarityLib
{
    private static readonly Dictionary<Rarity, float> RarityPercentages = new Dictionary<Rarity, float>
    {
        { Rarity.Abundant, 1f },
        { Rarity.Common, 0.8f },
        { Rarity.Uncommon, 0.5f },
        { Rarity.Rare, 0.2f },
        { Rarity.VeryRare, 0.05f },
        { Rarity.Magical, 0.01f },
        { Rarity.Elite, 0.005f },
        { Rarity.Epic, 0.002f },
        { Rarity.Legendary, 0.001f },
        { Rarity.Mythic, 0.0005f },
        { Rarity.Mythicc, 0.0002f },
        { Rarity.Artifact, 0.0001f },
        { Rarity.Divine, 0.00005f },
        { Rarity.Celestial, 0.00002f },
        { Rarity.RealityAnchor, 0.00001f },
        { Rarity.Structural, 0.000005f },
        { Rarity.Singularity, 0.000002f },
        { Rarity.Void, 0.000001f },
        { Rarity.Elder, 0.0000005f },
        { Rarity.Layer, 0.0000002f },
        { Rarity.Plane, 0.0000001f },
        { Rarity.Author, 0.00000005f }
    };

    public static float GetPercentage(Rarity rarity)
    {
        return RarityPercentages.TryGetValue(rarity, out float percentage) ? percentage : 0f;
    }

    public static HexColor GetColor(Rarity value)
    {
        switch (value)
        {
            default:
                return new HexColor("#ffffff");
            case Rarity.Common:
                return new HexColor("#ffffff");
            case Rarity.Uncommon:
                return new HexColor("#31aa3e");
            case Rarity.Rare:
                return new HexColor("#5888cf");
            case Rarity.VeryRare:
                return new HexColor("#3e31aa");
            case Rarity.Magical:
                return new HexColor("#9c93e0");
            case Rarity.Elite:
                return new HexColor("#8f3187");
            case Rarity.Epic:
                return new HexColor("#ffd700");
            case Rarity.Legendary:
                return new HexColor("#ffa500");
            case Rarity.Mythic:
                return new HexColor("#ff005a");
            case Rarity.Mythicc:
                return new HexColor("#ff005a");
            case Rarity.Artifact:
                return new HexColor("#b8860b");
            case Rarity.Divine:
                return new HexColor("#ffe34d");
            case Rarity.Celestial:
                return new HexColor("#210061");
            case Rarity.RealityAnchor:
                return new HexColor("#8b4513");
            case Rarity.Structural:
                return new HexColor("#140007");
            case Rarity.Singularity:
                return new HexColor("#000714");
            case Rarity.Void:
                return new HexColor("#000000");
            case Rarity.Elder:
                return new HexColor("#b0b0b0");
            case Rarity.Layer:
                return new HexColor("#808080");
            case Rarity.Plane:
                return new HexColor("#404040");
            case Rarity.Author:
                return new HexColor("#000000");
        }
    }

    public static HexColor GetColorBackground(Rarity value)
    {
        switch (value)
        {
            default:
                return new HexColor("#d9d9d9");
            case Rarity.Common:
                return new HexColor("#d9d9d9");
            case Rarity.Uncommon:
                return new HexColor("#206f28");
            case Rarity.Rare:
                return new HexColor("#203f6f");
            case Rarity.VeryRare:
                return new HexColor("#6558cf");
            case Rarity.Magical:
                return new HexColor("#9c93e0");
            case Rarity.Elite:
                return new HexColor("#561d51");
            case Rarity.Epic:
                return new HexColor("#b39700");
            case Rarity.Legendary:
                return new HexColor("#b37400");
            case Rarity.Mythic:
                return new HexColor("#b3003f");
            case Rarity.Mythicc:
                return new HexColor("#b3003f");
            case Rarity.Artifact:
                return new HexColor("#705107");
            case Rarity.Divine:
                return new HexColor("#ffd700");
            case Rarity.Celestial:
                return new HexColor("#fbd100");
            case Rarity.RealityAnchor:
                return new HexColor("#0a0f48");
            case Rarity.Structural:
                return new HexColor("#610022");
            case Rarity.Singularity:
                return new HexColor("#000714");
            case Rarity.Void:
                return new HexColor("#1b001b");
            case Rarity.Elder:
                return new HexColor("#b0b0b0");
            case Rarity.Layer:
                return new HexColor("#808080");
            case Rarity.Plane:
                return new HexColor("#404040");
            case Rarity.Author:
                return new HexColor("#000000");
        }
    }

    public static Rarity GuessRarity(string inputString)
    {
        if (string.IsNullOrWhiteSpace(inputString))
            return Rarity.Abundant;

        string normalizedInput = inputString.Replace(" ", "").Replace("_", "").Replace("-", "").ToLowerInvariant();

        foreach (var name in Enum.GetNames(typeof(Rarity)))
        {
            string normalizedEnum = name.Replace(" ", "").Replace("_", "").Replace("-", "").ToLowerInvariant();
            if (normalizedInput == normalizedEnum)
            {
                return (Rarity)Enum.Parse(typeof(Rarity), name);
            }
        }

        return Rarity.Abundant;
    }



    public static List<(Rarity, float)> ParseRarityData(string[] lines)
    {
        var rarities = new List<(Rarity, float)>();
        foreach (var line in lines)
        {
            var fields = line.Split('\t'); // Assuming tab-separated values
            if (fields.Length >= 2 && Enum.TryParse(fields[0], out Rarity rarity) && float.TryParse(fields[1], out float percentage))
            {
                rarities.Add((rarity, percentage));
            }
        }

        // Return the default rarities if the parsing fails
        return rarities.Count > 0 ? rarities : GetDefaultRarities();
    }

    public static List<(Rarity, float)> GetDefaultRarities()
    {
        return Enum.GetValues(typeof(Rarity)).Cast<Rarity>().Select(r => (r, GetPercentage(r))).ToList();
    }

    public static List<(Rarity, float)> LoadRarities(string filePath)
    {
        if (!File.Exists(filePath))
        {
            Debug.LogWarning($"CSV file not found: {filePath}");
            return null;
        }

        var lines = File.ReadAllLines(filePath).Skip(1).ToArray(); // Skip header
        return ParseRarityData(lines);
    }
}
