import UserService from "../service/UserService.js";

class UserController {
  static async register(req, res) {
    try {
      const user = await UserService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const user = await UserService.login(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.query.userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.query.userId, req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async resetPassword(req, res) {
    try {
      const result = await UserService.resetPassword(req.body.email);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async googleLogin(req, res) {
    try {
      const user = await UserService.googleLogin(req.user);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default UserController;