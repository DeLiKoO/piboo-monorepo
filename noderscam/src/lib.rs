use std::ops::Deref;

use napi::{*, bindgen_prelude::*};
use napi_derive::napi;

use rscam;

trait SmartPush {
    type Item;
    fn smart_push(&mut self, item: Self::Item) -> usize;
}

impl<T> SmartPush for Vec<T> {
    type Item = T;
    fn smart_push(&mut self, item: T) -> usize {
        let idx = self.len();
        self.push(item);
        idx
    }
}

#[napi(object)]
pub struct Webcam {
    pub index: u32 // index inside cameras Vec
}

// TODO: Change to Vec<Maybe<rscam::Camera>>
// TODO: Reuse Empty values for allocating new cameras
// TODO: Create alloc and free functions
static mut CAMERAS: Vec<rscam::Camera> = Vec::new();

impl ObjectFinalize for Webcam {

  fn finalize(self, _env: Env) -> Result<()> {
    Ok(())
  }

}

#[napi]
impl Webcam {
    #[napi(constructor)]
    pub fn new(device: String) -> Self {
        let mut camera = rscam::new(&device[..]).unwrap();
        camera.start(&rscam::Config {
            interval: (1, 30),      // 30 fps.
            resolution: (1920, 1080),
            format: b"MJPG",
            ..Default::default()
        }).unwrap();
        let index = unsafe {
            CAMERAS.smart_push(camera)
        };
        Webcam {
            index: index as u32 //dangerous ?
        }
    }

    #[napi]
    pub fn capture(&self) -> Buffer {
        let camera = unsafe {
            &CAMERAS[self.index as usize]
        };
        let frame = camera.capture().unwrap();
        frame.deref().into()
    }

}
