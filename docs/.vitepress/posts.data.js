import { createContentLoader } from 'vitepress'

export default createContentLoader(['./*.md', './**/*.md'], {
  transform(rawData) {
    // First, filter out all posts without title
    const validPosts = rawData.filter(post => post.frontmatter?.title)
    
    // Separate root posts from sectioned posts
    const rootPosts = []
    const sections = {}

    validPosts.forEach(post => {
      const urlParts = post.url.split('/')
      
      // Root level posts (e.g., /about.html)
      if (urlParts.length === 2) {
        rootPosts.push(post)
      } 
      // Subdirectory posts (e.g., /blog/post1.html)
      else if (urlParts.length >= 3) {
        const directory = urlParts[1] // e.g., 'blog'
        
        if (!sections[directory]) sections[directory] = []
        sections[directory].push(post)
      }
    })

    // Sort root posts alphabetically by title
    rootPosts.sort((a, b) => {
      return a.frontmatter.title.localeCompare(b.frontmatter.title)
    })

    // Convert sections object to array and sort
    const sectionArray = Object.entries(sections).map(([key, posts]) => ({
      key,
      title: key, // Section title is the folder name
      posts: posts.sort((a, b) => {
        // Sort posts within section by title
        return a.frontmatter.title.localeCompare(b.frontmatter.title)
      })
    }))

    // Sort sections alphabetically by title (folder name)
    sectionArray.sort((a, b) => a.title.localeCompare(b.title))

    return {
      rootPosts,
      sections: sectionArray
    }
  }
})