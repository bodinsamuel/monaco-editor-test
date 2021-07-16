// https://regex101.com/r/Jxa3KX/4
export const REQUIRE_PATTERN = /(const|let|var)(.|\n)*? require\(('|")(.*)('|")\);?$/gm;

// this handle ths 'from' imports  https://regex101.com/r/hdEpzO/4
export const ES6_PATTERN = /(import|export)((?!from)(?!require)(.|\n))*?(from|require\()\s?('|")(.*)('|")\)?;?$/gm;

// https://regex101.com/r/hdEpzO/8
export const ES6_IMPORT = /import\s+?\(?('|")(.*)('|")\)?;?/gm;
