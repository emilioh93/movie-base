import React, { useEffect, useState, useCallback, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import axios from 'axios';
import {
  img_500,
  unavailable,
  unavailableLandscape,
} from '../../config/config';
import './ContentModal.css';
import { Button } from '@material-ui/core';
import YouTubeIcon from '@material-ui/icons/YouTube';
import Carousel from '../Carousel/Carousel';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import { FormattedMessage } from 'react-intl';
import { MyListContext } from '../../context/MyListContext';
import Swal from 'sweetalert2';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: '90%',
    height: '80%',
    backgroundColor: 'var(--azul-oscuro)',
    border: '1px solid #282c34',
    borderRadius: 10,
    color: 'white',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 3),
  },
}));

export default function TransitionsModal({ children, media_type, id }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState();
  const [video, setVideo] = useState();
  const lang = localStorage.getItem('lang');
  const { myList } = useContext(MyListContext);
  const { setMyList } = useContext(MyListContext);
  const found = myList.find(item => {
    return item.id === id;
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const fetchData = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=${lang}`
    );

    setContent(data);
  };

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=${lang}`
    );

    setVideo(data.results[0]?.key);
  };

  const saveLS = items => {
    localStorage.setItem('add-my-list', JSON.stringify(items));
  };

  const addToMyList = contentParam => {
    handleClose();
    Swal.fire(
      'Added to My List',
      'The movie or series you selected was added successfully.',
      'success'
    );
    const newMyListArray = [...myList, contentParam];
    setMyList(newMyListArray);
    saveLS(newMyListArray);
  };

  const deleteFromMyList = contentParam => {
    handleClose();
    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: 'Are you sure you want to remove it from your list?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
    }).then(async result => {
      if (result.isConfirmed) {
        const newMyListArray = myList.filter(
          myListParam => myListParam.id !== contentParam.id
        );
        setMyList(newMyListArray);
        saveLS(newMyListArray);
        Swal.fire(
          'Movie deleted!',
          'The movie was removed from your list.',
          'success'
        );
      }
    });
  };

  useEffect(() => {
    fetchData();
    fetchVideo();
    // eslint-disable-next-line
  }, [myList, lang]);

  return (
    <>
      <div
        className='media'
        style={{ cursor: 'pointer' }}
        color='inherit'
        onClick={handleOpen}
      >
        {children}
      </div>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          {content && (
            <div className={classes.paper}>
              <div className='ContentModal'>
                <img
                  src={
                    content.poster_path
                      ? `${img_500}/${content.poster_path}`
                      : unavailable
                  }
                  alt={content.name || content.title}
                  className='ContentModal_portrait'
                />
                <img
                  src={
                    content.backdrop_path
                      ? `${img_500}/${content.backdrop_path}`
                      : unavailableLandscape
                  }
                  alt={content.name || content.title}
                  className='ContentModal_landscape'
                />
                <div className='ContentModal_about'>
                  <span className='ContentModal_title'>
                    {content.name || content.title} (
                    {(
                      content.first_air_date ||
                      content.release_date ||
                      '-----'
                    ).substring(0, 4)}
                    )
                  </span>
                  {content.tagline && (
                    <i className='tagline'>{content.tagline}</i>
                  )}

                  <span className='ContentModal_description'>
                    {content.overview}
                  </span>

                  <div>
                    <Carousel id={id} media_type={media_type} />
                  </div>
                  <div
                    className='ContentModal_bottons'
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                    }}
                  >
                    <Button
                      style={{
                        backgroundColor: 'var(--naranja)',
                      }}
                      variant='contained'
                      startIcon={<YouTubeIcon />}
                      color='secondary'
                      target='__blank'
                      href={`https://www.youtube.com/watch?v=${video}`}
                    >
                      <FormattedMessage
                        id='app.trailer'
                        defaultMessage='Watch the Trailer'
                      ></FormattedMessage>
                    </Button>
                    {found ? (
                      <Button
                        style={{
                          backgroundColor: 'red',
                        }}
                        variant='contained'
                        startIcon={<DeleteIcon />}
                        color='secondary'
                        target='__blank'
                        onClick={e => {
                          e.preventDefault();
                          deleteFromMyList(content);
                        }}
                      >
                        <FormattedMessage
                          id='app.myList.remove'
                          defaultMessage='Remove from My List'
                        />
                      </Button>
                    ) : (
                      <Button
                        style={{
                          backgroundColor: 'green',
                        }}
                        variant='contained'
                        startIcon={<PlaylistAddIcon />}
                        color='secondary'
                        target='__blank'
                        onClick={e => {
                          e.preventDefault();
                          addToMyList(content);
                        }}
                      >
                        <FormattedMessage
                          id='app.myList.add'
                          defaultMessage='Add to My List'
                        />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Fade>
      </Modal>
    </>
  );
}
