import { useLocation, useNavigate, useParams } from "react-router"

import { Box, Button, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { createPost, updatePost } from "../services/PostsService"

function PostsAddEdit() {

    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    console.log(location.state)
    const isNew = id === 'new'

    const [post, setPost] = useState(isNew ? {
        user_id: '',
        title: '',
        content: ''
    } : location.state)
    const [errors, setErrors] = useState<{
        user_id?: {
            message: string
        },
        title?: {
            message: string
        },
        content?: {
            message: string
        },
     }>({})
    const [error, setError] = useState('')

    function save() {
        setErrors({})
        setError('')
        if (isNew) {
            createPost(post).then(response => {
                // message TODO
                console.log(response)
                navigate('/posts')
            }).catch(error => {
                console.log(error)
                console.log(error.response)
                if (error?.response?.data?.errors) {
                    setErrors(error.response.data.errors)
                }
                if (error?.response?.data?.error) {
                    if (error.response.status === 409) {
                        setErrors({
                            user_id: {
                                message: error.response.data.message
                            }
                        })
                    } else {
                        setError(error.response.data.message)
                    }
                }
            })
        } else {
            updatePost(post._id, {
                _id: post._id,
                title: post.title,
                content: post.content,
            }).then(response => {
                // message TODO
                console.log(response)
                navigate('/blog')
            }).catch(error => {
                console.log(error)
                console.log(error.response)
                if (error?.response?.data?.errors) {
                    setErrors(error.response.data.errors)
                }
                if (error?.response?.data?.error) {
                    if (error.response.status === 409) {
                        setErrors({
                            user_id: {
                                message: error.response.data.message
                            }
                        })
                    } else {
                        setError(error.response.data.message)
                    }
                }
            })
        }
    }

    return <Box>
        <h2>{isNew ? 'Add' : 'Edit'} Post</h2>
        <TextField
            id="userid"
            fullWidth
            label="User Id"
            variant="outlined"
            value={post.user_id}
            onChange={event => {
                setPost({
                    ...post, user_id: event.target.value
                })
            }}
            error={errors.user_id !== undefined}
            helperText={errors.user_id?.message}
            sx={{ m: 1 }}
        />
        <TextField
            id="title"
            fullWidth
            label="Title"
            variant="outlined"
            value={post.title}
            onChange={event => {
                setPost({
                    ...post, title: event.target.value
                })
            }}
            error={errors.title !== undefined}
            helperText={errors.title?.message}
            sx={{ m: 1 }}
        />
        <TextField
            id="content"
            fullWidth
            label="Content"
            variant="outlined"
            value={post.content}
            onChange={event => {
                setPost({
                    ...post, content: event.target.value
                })
            }}
            error={errors.content !== undefined}
            helperText={errors.content?.message}
            sx={{ m: 1 }}
            multiline
            minRows={5}
        />
        <Typography color='error'>{error}</Typography>
        <Button variant="outlined" sx={{ m: 1 }} onClick={() => navigate('/posts')}>
            Cancel
        </Button>
        <Button variant="contained" sx={{ m: 1 }} onClick={() => save()}>
            Save
        </Button>
    </Box>
}

export default PostsAddEdit