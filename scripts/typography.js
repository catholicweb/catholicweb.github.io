// scripts/generate-typography.mjs
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { execSync } from 'child_process'
import Typography from 'typography'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configure your theme name here
const THEME_NAME = 'parnassus'

// All available themes
const ALL_THEMES = [
  'wordpress-2016',
  'wordpress-2015', 
  'wordpress-2014',
  'wordpress-2013',
  'wordpress-kubrick',
  'github',
  'bootstrap',
  'funston',
  'kirkham',
  'lawton',
  'lincoln',
  'moraga',
  'noriega',
  'ocean-beach',
  'parnassus',
  'st-annes',
  'stern-grove',
  'sutro',
  'twin-peaks',
  'us-web-design-standards',
  'wikipedia',
  'fairy-gates',
  'elk-glen'
]

async function getTheme(themeName) {
  const packageName = `typography-theme-${themeName}`
  
  console.log(`Installing theme: ${packageName}...`)
  
  try {
    execSync(`npm install ${packageName}`, { 
      stdio: 'pipe',
      cwd: resolve(__dirname)
    })
    console.log(`✓ Theme installed: ${themeName}`)
    
    // Import the theme
    const themeModule = await import(packageName)
    return themeModule.default

  } catch (error) {
    console.error(`✗ Failed to install: ${themeName}`)
    return null
  }
}

async function extractAllThemeConfigs() {
  const themeConfigs = {}
  
  console.log('\n=== Extracting all theme configurations ===\n')
  
  for (const themeName of ALL_THEMES) {
    const config = await getTheme(themeName)
    if (config) {
      themeConfigs[themeName] = config
    }
  }
  
  const outputPath = resolve(__dirname, 'typography-themes.json')
  writeFileSync(outputPath, JSON.stringify(themeConfigs, null, 2), 'utf8')
  
  console.log(`\n✓ All theme configs saved to: ${outputPath}`)
  console.log(`✓ Total themes extracted: ${Object.keys(themeConfigs).length}`)
}

function generateGoogleFontsUrl(config) {
  let googleFonts = config.default.googleFonts
  
  // If googleFonts doesn't exist, create it from font families
  if (!googleFonts || googleFonts.length === 0) {
    const fonts = new Set()
    const genericFonts = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui']
    
    // Extract fonts from headerFontFamily
    if (config.headerFontFamily && config.headerFontFamily.length > 0) {
      config.headerFontFamily.forEach(font => {
        if (!genericFonts.includes(font.toLowerCase())) {
          fonts.add(font)
        }
      })
    }
    
    // Extract fonts from bodyFontFamily
    if (config.bodyFontFamily && config.bodyFontFamily.length > 0) {
      config.bodyFontFamily.forEach(font => {
        if (!genericFonts.includes(font.toLowerCase())) {
          fonts.add(font)
        }
      })
    }
    
    if (fonts.size === 0) {
      return null
    }
    
    // Create googleFonts array with common weights
    googleFonts = Array.from(fonts).map(font => ({
      name: font,
      styles: ['400', '400i', '700', '700i']
    }))
  }
  
  // Build Google Fonts URL from googleFonts array
  const families = googleFonts.map(font => {
    const fontName = font.name.replace(/ /g, '+')
    
    // Convert styles array to Google Fonts CSS2 API format
    // styles like ['400', '400i', '700', '700i'] -> 'ital,wght@0,400;0,700;1,400;1,700'
    const weights = []
    const italicWeights = []
    
    font.styles.forEach(style => {
      if (style.endsWith('i')) {
        italicWeights.push(style.replace('i', ''))
      } else {
        weights.push(style)
      }
    })
    
    const axisValues = []
    weights.forEach(w => axisValues.push(`0,${w}`))
    italicWeights.forEach(w => axisValues.push(`1,${w}`))
    
    return `family=${fontName}:ital,wght@${axisValues.join(';')}`
  })
  
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
}

async function generateTypographyCSS(themeName) {
  const configPath = resolve(__dirname, 'typography-themes.json')
  
  if (!existsSync(configPath)) {
    throw new Error('typography-themes.json not found. Run with --extract-all first.')
  }
  
  const allConfigs = JSON.parse(readFileSync(configPath, 'utf8'))
  const config = allConfigs[themeName]
  
  if (!config) {
    throw new Error(`Theme "${themeName}" not found in typography-themes.json`)
  }
  
  // Generate CSS using Typography.js
  const typography = new Typography(config)
  const css = typography.toString()
  
  // Generate Google Fonts URL
  let finalCSS = ''
  const googleFontsUrl = generateGoogleFontsUrl(config)
  
  if (googleFontsUrl) {
    finalCSS = `@import url('${googleFontsUrl}');\n\n`
    console.log('✓ Google Fonts URL generated:', googleFontsUrl)
  }
  
  finalCSS += css
  
  // Write to file
  const themeDir = resolve(__dirname,'..','docs','.vitepress','theme','typography.css')
  writeFileSync(themeDir, finalCSS, 'utf8')
  
  console.log(`✓ Typography CSS saved to: ${themeDir}`)
  console.log(`\nNow import it in your theme:\nimport './typography.css'`)
}

async function main() {
  const mode = process.argv[2]
  
  if (mode === '--extract-all') {
    // Extract all theme configs
    await extractAllThemeConfigs()
    
  } else {
    // Normal mode - generate CSS for configured theme
    try {    
      // Generate CSS
      await generateTypographyCSS(THEME_NAME)
      console.log('✓ CSS generated with Typography.js')
      console.log('✓ Google Fonts included')
      
    } catch (error) {
      console.error('Error generating typography CSS:', error.message)
      process.exit(1)
    }
  }
}

main()

// package.json - only need Typography.js:
/*
{
  "devDependencies": {
    "typography": "^0.16.21"
  },
  "scripts": {
    "generate:typography": "node scripts/generate-typography.mjs",
    "extract:all-themes": "node scripts/generate-typography.mjs --extract-all",
    "docs:build": "npm run generate:typography && vitepress build",
    "docs:dev": "npm run generate:typography && vitepress dev"
  }
}
*/

// Usage:
// 1. First, extract all themes (only needed once):
//    node scripts/generate-typography.mjs --extract-all
//
// 2. Then generate CSS for your chosen theme:
//    node scripts/generate-typography.mjs