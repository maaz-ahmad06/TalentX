import { WorkLog } from '../models/WorkLog.js';
import { Contract } from '../models/Contract.js';

// @desc    Get all work logs for a contract
// @route   GET /api/worklogs/contract/:contractId
// @access  Public / Authenticated
export const getContractWorkLogs = async (req, res) => {
  try {
    const { contractId } = req.params;
    const workLogs = await WorkLog.find({ contractId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: workLogs.length,
      workLogs
    });
  } catch (err) {
    console.error('getContractWorkLogs error:', err.message);
    res.status(500).json({ success: false, message: 'Server error retrieving work logs', error: err.message });
  }
};

// @desc    Create a new Work Log / Daily Standup
// @route   POST /api/worklogs
// @access  Public / Authenticated
export const createWorkLog = async (req, res) => {
  try {
    const {
      contractId,
      milestoneId,
      milestoneTitle,
      freelancerId,
      freelancerName,
      freelancerAvatar,
      clientId,
      clientName,
      type = 'standup',
      title,
      summary,
      tasksCompleted,
      blockers,
      hoursSpent = 0,
      minutesSpent = 0,
      hourlyRate = 0,
      version = 'v1.0',
      deliverableLinks = []
    } = req.body;

    if (!contractId || !freelancerId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Contract ID, Freelancer ID, and Title are required'
      });
    }

    const totalHours = (Number(hoursSpent) || 0) + ((Number(minutesSpent) || 0) / 60);
    const billableAmount = Math.round(totalHours * (Number(hourlyRate) || 0));

    const workLog = await WorkLog.create({
      contractId,
      milestoneId,
      milestoneTitle,
      freelancerId,
      freelancerName: freelancerName || 'Freelancer',
      freelancerAvatar,
      clientId: clientId || 'client_1',
      clientName: clientName || 'Client',
      type,
      title,
      summary,
      tasksCompleted: Array.isArray(tasksCompleted) ? tasksCompleted : (tasksCompleted ? [tasksCompleted] : []),
      blockers,
      hoursSpent: Number(hoursSpent) || 0,
      minutesSpent: Number(minutesSpent) || 0,
      hourlyRate: Number(hourlyRate) || 0,
      billableAmount,
      version: version || 'v1.0',
      deliverableLinks,
      status: type === 'deliverable' ? 'submitted' : 'approved',
      date: new Date()
    });

    // Broadcast via Socket.io if available
    if (req.io) {
      req.io.emit('work_log_created', {
        contractId,
        workLog
      });
    }

    res.status(201).json({
      success: true,
      message: 'Work log entry created successfully',
      workLog
    });
  } catch (err) {
    console.error('createWorkLog error:', err.message);
    res.status(500).json({ success: false, message: 'Server error saving work log', error: err.message });
  }
};

// @desc    Log Timesheet Stopwatch or Manual Time Entry
// @route   POST /api/worklogs/timesheet
// @access  Public / Authenticated
export const logTimesheet = async (req, res) => {
  try {
    const {
      contractId,
      milestoneId,
      milestoneTitle,
      freelancerId,
      freelancerName,
      clientId,
      clientName,
      title,
      summary,
      hoursSpent,
      minutesSpent,
      hourlyRate,
      timerStartedAt,
      timerStoppedAt
    } = req.body;

    const totalHours = (Number(hoursSpent) || 0) + ((Number(minutesSpent) || 0) / 60);
    const billableAmount = Math.round(totalHours * (Number(hourlyRate) || 0));

    const workLog = await WorkLog.create({
      contractId,
      milestoneId,
      milestoneTitle,
      freelancerId,
      freelancerName: freelancerName || 'Freelancer',
      clientId: clientId || 'client_1',
      clientName: clientName || 'Client',
      type: 'timesheet',
      title: title || 'Tracked Development Hours',
      summary: summary || 'Active working session logged via live time tracker',
      hoursSpent: Number(hoursSpent) || 0,
      minutesSpent: Number(minutesSpent) || 0,
      hourlyRate: Number(hourlyRate) || 0,
      billableAmount,
      timerStartedAt: timerStartedAt ? new Date(timerStartedAt) : null,
      timerStoppedAt: timerStoppedAt ? new Date(timerStoppedAt) : null,
      status: 'approved',
      date: new Date()
    });

    if (req.io) {
      req.io.emit('work_log_created', {
        contractId,
        workLog
      });
    }

    res.status(201).json({
      success: true,
      message: 'Timesheet logged successfully',
      workLog
    });
  } catch (err) {
    console.error('logTimesheet error:', err.message);
    res.status(500).json({ success: false, message: 'Server error logging timesheet', error: err.message });
  }
};

// @desc    Review or change status of a Deliverable Version
// @route   PUT /api/worklogs/:id/review
// @access  Public / Authenticated
export const reviewDeliverable = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, clientFeedback, reviewedBy } = req.body;

    const workLog = await WorkLog.findById(id);
    if (!workLog) {
      return res.status(404).json({ success: false, message: 'Work log not found' });
    }

    if (status) workLog.status = status;
    if (clientFeedback !== undefined) workLog.clientFeedback = clientFeedback;
    workLog.reviewedAt = new Date();
    workLog.reviewedBy = reviewedBy || 'Client';

    await workLog.save();

    if (req.io) {
      req.io.emit('work_log_updated', {
        contractId: workLog.contractId,
        workLog
      });
    }

    res.status(200).json({
      success: true,
      message: `Deliverable marked as ${status}`,
      workLog
    });
  } catch (err) {
    console.error('reviewDeliverable error:', err.message);
    res.status(500).json({ success: false, message: 'Server error reviewing deliverable', error: err.message });
  }
};

// @desc    Delete a work log
// @route   DELETE /api/worklogs/:id
// @access  Public / Authenticated
export const deleteWorkLog = async (req, res) => {
  try {
    const { id } = req.params;
    const workLog = await WorkLog.findByIdAndDelete(id);
    if (!workLog) {
      return res.status(404).json({ success: false, message: 'Work log not found' });
    }

    if (req.io) {
      req.io.emit('work_log_deleted', {
        contractId: workLog.contractId,
        logId: id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Work log deleted successfully'
    });
  } catch (err) {
    console.error('deleteWorkLog error:', err.message);
    res.status(500).json({ success: false, message: 'Server error deleting work log', error: err.message });
  }
};
