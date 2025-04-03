const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Get all notes for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.userId }).sort({ updatedAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single note
router.get('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.userId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new note
router.post('/', auth, async (req, res) => {
    const note = new Note({
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        tags: req.body.tags,
        user: req.userId
    });

    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a note
router.put('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.userId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (req.body.title) note.title = req.body.title;
        if (req.body.content) note.content = req.body.content;
        if (req.body.category) note.category = req.body.category;
        if (req.body.tags) note.tags = req.body.tags;

        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.userId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await Note.deleteOne({ _id: req.params.id });
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 