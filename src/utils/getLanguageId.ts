const languageMap: Record<string, number> = {
    "assembly": 45,
    "bash": 46,
    "basic": 47,
    "c": 103,  // Latest GCC 14.1.0
    "c++": 105, // Latest GCC 14.1.0
    "c#": 51,
    "clojure": 86,
    "cobol": 77,
    "common lisp": 55,
    "dart": 90,
    "d": 56,
    "elixir": 57,
    "erlang": 58,
    "f#": 87,
    "fortran": 59,
    "go": 95, // Latest Go 1.18.5
    "groovy": 88,
    "haskell": 61,
    "java": 91, // Latest JDK 17.0.6
    "javafx": 96,
    "javascript": 102, // Latest Node.js 22.08.0
    "kotlin": 78,
    "lua": 64,
    "objective-c": 79,
    "ocaml": 65,
    "octave": 66,
    "pascal": 67,
    "perl": 85,
    "php": 98, // Latest PHP 8.3.11
    "prolog": 69,
    "python": 100, // Latest Python 3.12.5
    "r": 99, // Latest R 4.4.1
    "ruby": 72,
    "rust": 73,
    "scala": 81,
    "sql": 82,
    "swift": 83,
    "typescript": 101, // Latest TypeScript 5.6.2
    "visual basic.net": 84
};

export const getLanguageId = (language: string): number | null => {
    return languageMap[language.toLowerCase()] || null;
};


