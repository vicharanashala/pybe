const fs = require('fs');
const path = require('path');

class PersonalizedRepo {
  constructor() {
    // We now point to two distinct, decoupled files
    this.archetypesPath = path.join(__dirname, '../data/master_archetypes.json');
    this.themesPath = path.join(__dirname, '../data/thematic_dictionaries.json');
  }

  getArchetype(archetypeId) {
    try {
      const rawData = fs.readFileSync(this.archetypesPath, 'utf8');
      const data = JSON.parse(rawData);
      return data.master_archetypes[archetypeId] || null;
    } catch (error) {
      console.error("Error reading master archetypes:", error);
      return null;
    }
  }

  getTheme(themeId) {
    try {
      const rawData = fs.readFileSync(this.themesPath, 'utf8');
      const data = JSON.parse(rawData);
      return data.thematic_dictionaries[themeId] || null;
    } catch (error) {
      console.error("Error reading thematic dictionaries:", error);
      return null;
    }
  }

  getAllCategories() {
    try {
      const rawData = fs.readFileSync(this.themesPath, 'utf8');
      const data = JSON.parse(rawData);
      const categoriesMap = {};
      
      for (const [key, value] of Object.entries(data.thematic_dictionaries)) {
        // Extract category id (e.g. 'pets' from 'pets_var' or 'popculture_avengers' if snake_case)
        const parts = key.split('_');
        const catId = parts.length > 1 ? parts.slice(0, -1).join('_') : parts[0];
        
        if (!categoriesMap[catId]) {
          const formattedName = catId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          categoriesMap[catId] = {
            id: catId,
            name: formattedName,
            domain: value.domain || 'the world',
            character: value.character || 'hero',
            defaultThemeId: key
          };
        }
      }
      return Object.values(categoriesMap);
    } catch (error) {
      console.error("Error reading categories:", error);
      return [];
    }
  }
}

module.exports = new PersonalizedRepo();
