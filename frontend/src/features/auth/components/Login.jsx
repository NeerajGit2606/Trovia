import { Box, Divider, FormHelperText, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { LoadingButton } from '@mui/lab';
import { selectLoggedInUser, loginAsync, selectLoginStatus, selectLoginError, clearLoginError, resetLoginStatus } from '../AuthSlice'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';

export const Login = () => {
  const dispatch = useDispatch()
  const status = useSelector(selectLoginStatus)
  const error = useSelector(selectLoginError)
  const loggedInUser = useSelector(selectLoggedInUser)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const theme = useTheme()
  const is900 = useMediaQuery(theme.breakpoints.down(900))
  const is480 = useMediaQuery(theme.breakpoints.down(480))

  useEffect(() => {
    if (loggedInUser && loggedInUser?.isVerified) navigate("/")
    else if (loggedInUser && !loggedInUser?.isVerified) navigate("/verify-otp")
  }, [loggedInUser])

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (status === 'fullfilled' && loggedInUser?.isVerified === true) {
      toast.success(`Welcome back!`)
      reset()
    }
    return () => {
      dispatch(clearLoginError())
      dispatch(resetLoginStatus())
    }
  }, [status])

  const handleLogin = (data) => {
    const cred = { ...data }
    delete cred.confirmPassword
    dispatch(loginAsync(cred))
  }

  const features = [
    { icon: <LocalShippingOutlinedIcon sx={{ fontSize: 20 }} />, text: "Free delivery on orders over $50" },
    { icon: <SecurityOutlinedIcon sx={{ fontSize: 20 }} />, text: "Secure payments & buyer protection" },
    { icon: <SupportAgentOutlinedIcon sx={{ fontSize: 20 }} />, text: "24/7 customer support" },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#EAEDED', display: 'flex', flexDirection: 'column' }}>

      {/* Top Navbar */}
      <Box sx={{ bgcolor: '#131921', py: 1.5, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#FF9900', letterSpacing: 2 }}>
          RIVAVIO
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, px: 2 }}>
        <Stack direction={is900 ? 'column' : 'row'} spacing={4} alignItems="center" justifyContent="center" maxWidth={900} width="100%">

          {/* Left side - Branding */}
          {!is900 && (
            <Stack flex={1} spacing={3}>
              <Stack>
                <Typography variant="h4" fontWeight={700} color="#131921">
                  Welcome to Rivavio
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={1}>
                  Your one-stop destination for everything you need, delivered fast.
                </Typography>
              </Stack>

              <Stack spacing={2}>
                {features.map((f, i) => (
                  <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ color: '#FF9900' }}>{f.icon}</Box>
                    <Typography variant="body2" color="text.secondary">{f.text}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Box sx={{ bgcolor: '#FFF3CD', border: '1px solid #FF9900', borderRadius: 2, p: 2 }}>
                <Typography variant="body2" color="#8B6914" fontWeight={500}>
                  🛍️ New arrivals added daily. Sign in to explore exclusive deals!
                </Typography>
              </Box>
            </Stack>
          )}

          {/* Right side - Login Form */}
          <Stack
            flex={1}
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              border: '1px solid #D5D9D9',
              p: is480 ? 3 : 4,
              width: is480 ? '95vw' : '100%',
              maxWidth: 400,
              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
            }}
          >
            {/* Form Header */}
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <Box sx={{ bgcolor: '#FF9900', borderRadius: '50%', p: 0.8, display: 'flex' }}>
                <LockOutlinedIcon sx={{ fontSize: 18, color: '#000' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} color="#0F1111">
                Sign in to Rivavio
              </Typography>
            </Stack>

            <Stack
              spacing={2}
              component={'form'}
              noValidate
              onSubmit={handleSubmit(handleLogin)}
            >
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={500} color="#0F1111">
                  Email address
                </Typography>
                <motion.div whileHover={{ y: -2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                        message: "Enter a valid email"
                      }
                    })}
                    placeholder="Enter your email"
                  />
                  {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
                </motion.div>
              </Stack>

              <Stack spacing={0.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" fontWeight={500} color="#0F1111">
                    Password
                  </Typography>
                  <Typography
                    variant="body2"
                    component={Link}
                    to="/forgot-password"
                    sx={{ color: '#0066C0', textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: '#C45500' } }}
                  >
                    Forgot password?
                  </Typography>
                </Stack>
                <motion.div whileHover={{ y: -2 }}>
                  <TextField
                    type="password"
                    fullWidth
                    size="small"
                    {...register("password", { required: "Password is required" })}
                    placeholder="Enter your password"
                  />
                  {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
                </motion.div>
              </Stack>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <LoadingButton
                  fullWidth
                  sx={{
                    height: '2.5rem',
                    bgcolor: '#FF9900',
                    color: '#000',
                    fontWeight: 600,
                    borderRadius: '4px',
                    boxShadow: '0 1px 0 rgba(255,255,255,.4) inset,0 1px 2px rgba(0,0,0,.2)',
                    '&:hover': { bgcolor: '#E47911' },
                    mt: 1
                  }}
                  loading={status === 'pending'}
                  type="submit"
                  variant="contained"
                >
                  Sign In
                </LoadingButton>
              </motion.div>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="body2" color="text.secondary">or</Typography>
                <Divider sx={{ flex: 1 }} />
              </Stack>

              <Box sx={{ border: '1px solid #D5D9D9', borderRadius: 1, p: 1.5, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  New to Rivavio?{' '}
                  <Typography
                    component={Link}
                    to="/signup"
                    variant="body2"
                    sx={{ color: '#0066C0', textDecoration: 'none', fontWeight: 500, '&:hover': { textDecoration: 'underline', color: '#C45500' } }}
                  >
                    Create your account
                  </Typography>
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#232F3E', py: 2, textAlign: 'center' }}>
        <Stack direction="row" justifyContent="center" spacing={3}>
          {['Conditions of Use', 'Privacy Notice', 'Help'].map((item) => (
            <Typography key={item} variant="body2" sx={{ color: '#DDD', cursor: 'pointer', '&:hover': { color: '#FF9900' } }}>
              {item}
            </Typography>
          ))}
        </Stack>
        <Typography variant="body2" color="#999" mt={1}>
          © 2024 Rivavio. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}
