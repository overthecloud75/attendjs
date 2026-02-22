const fs = require('fs')
const path = require('path')

const srcDir = path.join(__dirname, '../src')

// Helper to recursively get all files
function getFiles(dir, files = []) {
    const fileList = fs.readdirSync(dir)
    for (const file of fileList) {
        const fullPath = path.join(dir, file)
        if (fs.statSync(fullPath).isDirectory()) {
            getFiles(fullPath, files)
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            files.push(fullPath)
        }
    }
    return files
}

const allFiles = getFiles(srcDir).filter(f =>
    !f.includes('useAuth.js') &&
    !f.includes('userSlice.js') &&
    !f.includes('AuthUtil.jsx') &&
    !f.includes('/scripts/')
)

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8')
    let original = content
    let modified = false

    // 1. Check if we need to replace useSelector for user
    const userSelectorRegex = /const\s+([a-zA-Z0-9_]+)\s*=\s*useSelector\(\s*(?:state)?\s*=>\s*state\.user\s*\)/g
    const loginSelectorRegex = /const\s+([a-zA-Z0-9_]+)\s*=\s*useSelector\(\s*(?:state)?\s*=>\s*state\.user\.isLogin\s*\)/g

    let usesAuth = false
    let useAuthImports = new Set()

    content = content.replace(userSelectorRegex, (match, varName) => {
        usesAuth = true
        if (varName === 'user') return 'const { user } = useAuth()'
        return `const { user: ${varName} } = useAuth()`
    })

    content = content.replace(loginSelectorRegex, (match, varName) => {
        usesAuth = true
        if (varName === 'isLogin') return 'const { isLogin } = useAuth()'
        return `const { isLogin: ${varName} } = useAuth()`
    })

    // If there's logout dispatch
    if (content.includes('dispatch(logoutAction())') || content.includes("requestAuth('logout'")) {
        // We will manually fix complex logout ones like ProfileMenu or Navbar, but we can do a naive replace for simple ones
        // Actually, ProfileMenu has: await requestAuth('logout', 'GET', '', dispatch, navigate, setErrorMsg)

        // Let's do a naive replace for requestAuth('logout'
        const reqAuthRegex = /await requestAuth\('logout', 'GET', '', dispatch, navigate, setErrorMsg\)/g
        if (reqAuthRegex.test(content)) {
            content = content.replace(reqAuthRegex, 'await logout(setErrorMsg)')
            usesAuth = true
        }

        const navActionRegex = /logoutAction\(\)/g
        if (content.includes('logoutAction()')) {
            usesAuth = true
            content = content.replace(/dispatch\(logoutAction\(\)\)/g, 'logout()')
        }
    }

    // Check if we need to add useAuth to component
    // If it uses logout but no useAuth was declared yet:
    // This is tricky because we must add it inside the component.
    // Better to just let human handle logout replacements if it doesn't already have `const { ... } = useAuth()` added.

    if (usesAuth) {
        // compute relative import
        let relPath = path.relative(path.dirname(file), path.join(srcDir, 'hooks/useAuth'))
        if (!relPath.startsWith('.')) relPath = './' + relPath
        // Remove .js extension to match existing styles
        if (relPath.endsWith('.js')) relPath = relPath.slice(0, -3)

        if (!content.includes('useAuth')) {
            // Wait, we already added `const { user } = useAuth()` to content. That string includes 'useAuth'.
            // Actually check original string.
        }

        const importStatement = `import { useAuth } from '${relPath}'\n`

        // add import at top right after react stuff
        // Just put it below the first import
        if (!original.includes(importStatement) && !original.includes('from \'' + relPath + '\'')) {
            content = content.replace(/^(import.*?(?:\n|;))*/m, match => match + importStatement)
        }

        // if useSelector is no longer used, we remove it from react-redux import
        if (!content.includes('useSelector(')) {
            content = content.replace(/import\s+{\s*useSelector\s*}\s+from\s+['"]react-redux['"]\s*\n?/g, '')
            // Also if it was imported with useDispatch: `import { useSelector, useDispatch } from 'react-redux'`
            content = content.replace(/,\s*useSelector\s*/g, '')
            content = content.replace(/useSelector\s*,\s*/g, '')

            // Cleanup empty curlies if left over: `import { } from 'react-redux'`
            content = content.replace(/import\s+{\s*}\s+from\s+['"]react-redux['"]\s*\n?/g, '')
        }
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8')
        console.log('Updated: ' + file)
    }
})
