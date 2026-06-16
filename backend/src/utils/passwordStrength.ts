import crypto from "crypto";

const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;
const commonPasswords = [
  "123456",
  "123456789",
  "qwerty",
  "password",
  "12345678",
  "111111",
  "1234567",
  "sunshine",
  "qwerty123",
  "iloveyou",
  "princess",
  "admin",
  "welcome",
  "666666",
  "abc123",
  "123123",
  "football",
  "1234",
  "passw0rd",
  "master",
  "hello",
  "freedom",
  "whatever",
  "qazwsx",
  "trustno1",
  "654321",
  "jordan23",
  "harley",
  "password1",
  "password123",
  "123qwe",
  "monkey",
  "dragon",
  "shadow",
  "baseball",
  "superman",
  "michael",
  "football1",
  "batman",
  "letmein",
  "hottie",
  "loveme",
  "zaq1zaq1",
  "charlie",
  "aa123456",
  "donald",
  "password!",
  "admin123",
  "welcome1",
  "login",
  "qwertyuiop",
  "starwars",
  "1234567890",
];

export const validatePasswordStrength = (password: string) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!passwordRegex.test(password)) {
    return "Password must include uppercase, lowercase, number, and special character.";
  }

  if (commonPasswords.includes(password.toLowerCase())) {
    return "Choose a less common password.";
  }

  return undefined;
};

export const isPwnedPassword = async (password: string) => {
  try {
    const sha1 = crypto
      .createHash("sha1")
      .update(password)
      .digest("hex")
      .toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
    );
    if (!response.ok) {
      return false;
    }
    const text = await response.text();
    return text.split("\n").some((line) => line.split(":")[0] === suffix);
  } catch {
    return false;
  }
};
