class User {
  constructor(user_id, fullname, email, role, created_at = new Date(), updated_at = new Date()) {
    this.user_id = user_id;
    this.fullname = fullname;
    this.email = email;
    this.role = role;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  toFirestore() {
    return {
      fullname: this.fullname,
      email: this.email,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

export default User;