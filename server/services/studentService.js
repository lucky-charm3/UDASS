const studentRepository = require('../repositories/studentRepository.js');

const StudentService = {
  async createStudent(req) {
    const userId = req.user ? req.user.id : "ADMIN_ID_MISSING"; 
    return await studentRepository.createStudent(req.body);
  },

  async getAllStudents(query = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      membership = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const MongooseQuery = {};

    if (search) {
      MongooseQuery.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { regNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (membership === 'active') {
      MongooseQuery.isMembershipActive = true;
    } else if (membership === 'expired') {
      MongooseQuery.isMembershipActive = false;
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [students, totalStudents] = await Promise.all([
      studentRepository.getAllStudents(MongooseQuery, skip, Number(limit), sort),
      studentRepository.countStudents(MongooseQuery)
    ]);

    return {
      students,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalStudents / limit),
        totalStudents: totalStudents,
        hasNext: page * limit < totalStudents,
        hasPrev: page > 1
      }
    };
  },


  async getStudentById(id) {
    return await studentRepository.getStudentById(id);
  },

  async updateStudentById(req) {
    const actorId = req.user._id;
    const studentId = req.params.id;
    const updateData = req.body;

    const oldStudent = await studentRepository.getStudentById(studentId);
    
    const updatedStudent = await studentRepository.updateStudentById(studentId, updateData);

    if (oldStudent.isMembershipActive === false && updatedStudent.isMembershipActive === true) {
      
      const html = `
        <div style="padding: 20px; text-align: center;">
          <h1 style="color: green;">Membership Approved! 🎉</h1>
          <p>Dear ${updatedStudent.fullName},</p>
          <p>Your payment has been verified and your account is now <strong>ACTIVE</strong>.</p>
          <p>You can now access the Dashboard, Announcements, and Events.</p>
          <a href="${process.env.CLIENT_URL}/dashboard" style="background: blue; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
        </div>
      `;
      
      await sendEmail({
        to: updatedStudent.email,
        subject: "Welcome to UDASS - Account Activated",
        html: html
      });
    }

    return updatedStudent;
  },


  async deleteStudentById(req) {
    const userId = req.params.id;
    return await studentRepository.deleteStudentById(req.params.id);
  },

  async getAdminStats() {
    return await studentRepository.getAdminStats();
  }
};

module.exports = StudentService;