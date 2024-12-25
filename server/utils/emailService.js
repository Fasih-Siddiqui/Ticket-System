import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Create a transporter using Gmail SMTP
const createTransporter = () => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    console.log('Email Configuration in emailService.js:');
    console.log('- USER:', user ? user : 'Not set');
    console.log('- PASS:', pass ? 'Set' : 'Not set');

    if (!user || !pass) {
        console.warn('Email credentials not configured. Check EMAIL_USER and EMAIL_PASS in .env');
        return null;
    }

    // Remove any spaces from the password
    const cleanPass = pass.replace(/\s+/g, '');

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: user,
            pass: cleanPass
        },
        debug: true
    });

    // Verify the connection configuration
    transporter.verify(function(error, success) {
        if (error) {
            console.log('SMTP connection error:', error);
        } else {
            console.log('SMTP server is ready to take our messages');
        }
    });

    return transporter;
};

const transporter = createTransporter();

// Function to send email
const sendEmail = async (to, template) => {
    if (!transporter) {
        console.warn('Email service not configured. Skipping email send.');
        return;
    }

    try {
        const emailTo = Array.isArray(to) ? to.join(', ') : to;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emailTo,
            subject: template.subject,
            text: template.text,
            html: template.html // Add HTML support
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Log more details about the error
        if (error.code === 'EAUTH') {
            console.error('Authentication failed. Check your Gmail credentials and app password.');
        }
    }
};

// Email templates
const emailTemplates = {
    ticketCreated: (ticket, creator) => ({
        subject: `New Ticket Created - ${ticket.ticketCode}`,
        text: `
            A new ticket has been created:
            Ticket Code: ${ticket.ticketCode}
            Title: ${ticket.title}
            Description: ${ticket.description}
            Priority: ${ticket.priority}
            Created by: ${creator.username}
        `,
        html: `
            <h2>New Ticket Created</h2>
            <p><strong>Ticket Code:</strong> ${ticket.ticketCode}</p>
            <p><strong>Title:</strong> ${ticket.title}</p>
            <p><strong>Description:</strong> ${ticket.description}</p>
            <p><strong>Priority:</strong> ${ticket.priority}</p>
            <p><strong>Created by:</strong> ${creator.username}</p>
        `
    }),
    
    ticketAssigned: (ticket, assignee) => ({
        subject: `Ticket Assigned - ${ticket.ticketCode}`,
        text: `
            A ticket has been assigned to you:
            Ticket Code: ${ticket.ticketCode}
            Title: ${ticket.title}
            Assigned to: ${assignee.username}
        `,
        html: `
            <h2>Ticket Assigned</h2>
            <p><strong>Ticket Code:</strong> ${ticket.ticketCode}</p>
            <p><strong>Title:</strong> ${ticket.title}</p>
            <p><strong>Assigned to:</strong> ${assignee.username}</p>
        `
    }),
    
    ticketResolved: (ticket, supportMember) => ({
        subject: `Ticket Resolved - ${ticket.ticketCode}`,
        text: `
            A ticket has been resolved:
            Ticket Code: ${ticket.ticketCode}
            Title: ${ticket.title}
            Resolved by: ${supportMember.username}
        `,
        html: `
            <h2>Ticket Resolved</h2>
            <p><strong>Ticket Code:</strong> ${ticket.ticketCode}</p>
            <p><strong>Title:</strong> ${ticket.title}</p>
            <p><strong>Resolved by:</strong> ${supportMember.username}</p>
        `
    }),
    
    ticketClosed: (ticket) => ({
        subject: `Ticket Closed - ${ticket.ticketCode}`,
        text: `
            A ticket has been closed:
            Ticket Code: ${ticket.ticketCode}
            Title: ${ticket.title}
        `,
        html: `
            <h2>Ticket Closed</h2>
            <p><strong>Ticket Code:</strong> ${ticket.ticketCode}</p>
            <p><strong>Title:</strong> ${ticket.title}</p>
        `
    }),

    newComment: (ticket, commenter) => ({
        subject: `New Comment on Ticket - ${ticket.ticketCode}`,
        text: `
            A new comment has been added to the ticket:
            Ticket Code: ${ticket.ticketCode}
            Title: ${ticket.title}
            Comment by: ${commenter.username}
            Comment: ${ticket.commentText}
        `,
        html: `
            <h2>New Comment on Ticket</h2>
            <p><strong>Ticket Code:</strong> ${ticket.ticketCode}</p>
            <p><strong>Title:</strong> ${ticket.title}</p>
            <p><strong>Comment by:</strong> ${commenter.username}</p>
            <p><strong>Comment:</strong> ${ticket.commentText}</p>
        `
    })
};

// Notification functions
const sendTicketCreationNotification = async (ticket, creator) => {
    console.log('Sending ticket creation notification:', { ticket, creator });
    const template = emailTemplates.ticketCreated(ticket, creator);
    
    // Send to creator
    if (creator.email) {
        console.log('Sending to creator:', creator.email);
        await sendEmail(creator.email, template);
    } else {
        console.log('Creator email not provided');
    }
    
    // Send to admin
    if (process.env.ADMIN_EMAIL) {
        console.log('Sending to admin:', process.env.ADMIN_EMAIL);
        await sendEmail(process.env.ADMIN_EMAIL, template);
    } else {
        console.log('Admin email not configured');
    }
};

const sendTicketAssignmentNotification = async (ticket, assignee) => {
    console.log('Sending ticket assignment notification:', { ticket, assignee });
    const template = emailTemplates.ticketAssigned(ticket, assignee);
    
    // Send to assignee
    if (assignee.email) {
        console.log('Sending to assignee:', assignee.email);
        await sendEmail(assignee.email, template);
    }
    
    // Send to admin
    if (process.env.ADMIN_EMAIL) {
        console.log('Sending to admin:', process.env.ADMIN_EMAIL);
        await sendEmail(process.env.ADMIN_EMAIL, template);
    }
};

const sendTicketResolutionNotification = async (ticket, supportMember, creator) => {
    console.log('Sending ticket resolution notification:', { ticket, supportMember, creator });
    const template = emailTemplates.ticketResolved(ticket, supportMember);
    
    // Send to creator
    if (creator.email) {
        console.log('Sending to creator:', creator.email);
        await sendEmail(creator.email, template);
    }
    
    // Send to support member
    if (supportMember.email) {
        console.log('Sending to support member:', supportMember.email);
        await sendEmail(supportMember.email, template);
    }
    
    // Send to admin
    if (process.env.ADMIN_EMAIL) {
        console.log('Sending to admin:', process.env.ADMIN_EMAIL);
        await sendEmail(process.env.ADMIN_EMAIL, template);
    }
};

const sendTicketClosureNotification = async (ticket, supportMember, creator) => {
    console.log('Sending ticket closure notification:', { ticket, supportMember, creator });
    const template = emailTemplates.ticketClosed(ticket);
    
    // Send to creator
    if (creator.email) {
        console.log('Sending to creator:', creator.email);
        await sendEmail(creator.email, template);
    }
    
    // Send to support member
    if (supportMember.email) {
        console.log('Sending to support member:', supportMember.email);
        await sendEmail(supportMember.email, template);
    }
    
    // Send to admin
    if (process.env.ADMIN_EMAIL) {
        console.log('Sending to admin:', process.env.ADMIN_EMAIL);
        await sendEmail(process.env.ADMIN_EMAIL, template);
    }
};

const sendCommentNotification = async (ticket, commenter, recipientEmails) => {
    console.log('Sending comment notification:', { ticket, commenter, recipientEmails });
    const template = emailTemplates.newComment(ticket, commenter);
    
    // Send to all recipients
    for (const email of recipientEmails) {
        console.log('Sending to recipient:', email);
        await sendEmail(email, template);
    }
};

export {
    sendEmail,
    sendTicketCreationNotification,
    sendTicketAssignmentNotification,
    sendTicketResolutionNotification,
    sendTicketClosureNotification,
    sendCommentNotification,
    emailTemplates
};
