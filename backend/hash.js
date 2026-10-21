import bcrypt from "bcryptjs";
const password = 'Zeeshan@123';
bcrypt.hash(password, 10, (err, hash) => {
  console.log('Hashed Password:', hash);
});