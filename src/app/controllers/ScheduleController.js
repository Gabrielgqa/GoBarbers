import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/User';
import Appointments from '../models/Appointment';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!checkUserProvider) {
      return res
        .status(401)
        .json({ error: 'Usuário não é prestador de serviço.' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointment = await Appointments.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
    });

    return res.json(appointment);
  }
}

export default new ScheduleController();
