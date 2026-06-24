import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Box, Button, InputAdornment, Stack, TextField, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../user/UserSlice';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TuneIcon from '@mui/icons-material/Tune';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { selectProductIsFilterOpen, toggleFilters } from '../../products/ProductSlice';

export const Navbar = ({ isProductList = false }) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userInfo = useSelector(selectUserInfo)
  const cartItems = useSelector(selectCartItems)
  const loggedInUser = useSelector(selectLoggedInUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useTheme()
  const is480 = useMediaQuery(theme.breakpoints.down(480))
  const is768 = useMediaQuery(theme.breakpoints.down(768))
  const wishlistItems = useSelector(selectWishlistItems)
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen)

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget)
  const handleCloseUserMenu = () => setAnchorElUser(null)
  const handleToggleFilters = () => dispatch(toggleFilters())

  const settings = [
    { name: "Home", to: "/" },
    { name: 'Profile', to: loggedInUser?.isAdmin ? "/admin/profile" : "/profile" },
    { name: loggedInUser?.isAdmin ? 'Orders' : 'My orders', to: loggedInUser?.isAdmin ? "/admin/orders" : "/orders" },
    { name: 'Logout', to: "/logout" },
  ];

  return (
    <Box>
      {/* Main Navbar - Dark */}
      <AppBar position="sticky" sx={{ bgcolor: '#131921', boxShadow: 'none' }}>
        <Toolbar sx={{ minHeight: '60px !important', px: { xs: 1, md: 2 }, gap: 1 }}>

          {/* Logo */}
          <Typography
            variant="h6"
            component="a"
            href="/"
            sx={{
              fontWeight: 800,
              color: '#FF9900',
              textDecoration: 'none',
              letterSpacing: 2,
              flexShrink: 0,
              fontSize: is480 ? '1.1rem' : '1.4rem',
              mr: 1,
            }}
          >
            RIVAVIO
          </Typography>

          {/* Search Bar */}
          {!is480 && (
            <Box sx={{ flex: 1, maxWidth: 600 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search products, brands..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    borderRadius: '4px',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                  },
                  '& .MuiInputBase-input': { py: 1, fontSize: '0.9rem' },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ bgcolor: '#FF9900', p: '6px 10px', borderRadius: '0 3px 3px 0', cursor: 'pointer', display: 'flex', '&:hover': { bgcolor: '#E47911' } }}>
                        <SearchIcon sx={{ color: '#000', fontSize: 20 }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          {/* Right Section */}
          <Stack direction="row" alignItems="center" spacing={is480 ? 0.5 : 1.5} ml="auto">

            {/* Account */}
            <Tooltip title="Account">
              <Box
                onClick={handleOpenUserMenu}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  p: '4px 8px',
                  borderRadius: 1,
                  border: '1px solid transparent',
                  '&:hover': { border: '1px solid white' },
                }}
              >
                <Avatar
                  alt={userInfo?.name}
                  src="null"
                  sx={{ width: 28, height: 28, bgcolor: '#FF9900', fontSize: 13, color: '#000', fontWeight: 700 }}
                >
                  {userInfo?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                {!is480 && (
                  <Stack>
                    <Typography variant="body2" fontSize={11} color="#CCC">Hello, {userInfo?.name?.split(' ')[0]}</Typography>
                    <Stack direction="row" alignItems="center">
                      <Typography variant="body2" fontSize={13} fontWeight={700} color="white">Account</Typography>
                      <KeyboardArrowDownIcon sx={{ fontSize: 16, color: 'white' }} />
                    </Stack>
                  </Stack>
                )}
              </Box>
            </Tooltip>

            <Menu
              sx={{ mt: '50px' }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{ sx: { minWidth: 180, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' } }}
            >
              {loggedInUser?.isAdmin && (
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography component={Link} color={'text.primary'} sx={{ textDecoration: "none" }} to="/admin/add-product">
                    Add new Product
                  </Typography>
                </MenuItem>
              )}
              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                  <Typography component={Link} color={'text.primary'} sx={{ textDecoration: "none" }} to={setting.to}>
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>

            {/* Orders */}
            {!is768 && (
              <Box
                component={Link}
                to="/orders"
                sx={{
                  textDecoration: 'none',
                  p: '4px 8px',
                  borderRadius: 1,
                  border: '1px solid transparent',
                  '&:hover': { border: '1px solid white' },
                }}
              >
                <Typography variant="body2" fontSize={11} color="#CCC">Returns</Typography>
                <Typography variant="body2" fontSize={13} fontWeight={700} color="white">& Orders</Typography>
              </Box>
            )}

            {/* Wishlist */}
            {!loggedInUser?.isAdmin && (
              <Badge badgeContent={wishlistItems?.length} color="error" sx={{ '& .MuiBadge-badge': { bgcolor: '#FF9900', color: '#000', fontWeight: 700 } }}>
                <IconButton component={Link} to="/wishlist" sx={{ color: 'white', p: 0.5, '&:hover': { color: '#FF9900' } }}>
                  <FavoriteBorderIcon />
                </IconButton>
              </Badge>
            )}

            {/* Cart */}
            <Badge badgeContent={cartItems?.length} color="error" sx={{ '& .MuiBadge-badge': { bgcolor: '#FF9900', color: '#000', fontWeight: 700 } }}>
              <Box
                onClick={() => navigate("/cart")}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
                  p: '4px 8px', borderRadius: 1, border: '1px solid transparent',
                  '&:hover': { border: '1px solid white' },
                }}
              >
                <ShoppingCartOutlinedIcon sx={{ color: 'white' }} />
                {!is480 && <Typography variant="body2" fontWeight={700} color="white" fontSize={13}>Cart</Typography>}
              </Box>
            </Badge>

            {/* Filter toggle */}
            {isProductList && (
              <IconButton onClick={handleToggleFilters} sx={{ color: isProductFilterOpen ? '#FF9900' : 'white' }}>
                <TuneIcon />
              </IconButton>
            )}

            {/* Admin badge */}
            {loggedInUser?.isAdmin && (
              <Button variant="contained" size="small" sx={{ bgcolor: '#FF9900', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#E47911' } }}>
                Admin
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Secondary nav bar */}
      <Box sx={{ bgcolor: '#232F3E', py: 0.5, px: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          {['All Deals', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books'].map((cat) => (
            <Typography
              key={cat}
              variant="body2"
              sx={{ color: 'white', cursor: 'pointer', fontSize: 13, py: 0.5, px: 1, borderRadius: 1, border: '1px solid transparent', '&:hover': { border: '1px solid white' }, whiteSpace: 'nowrap' }}
            >
              {cat}
            </Typography>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
